import {GLOBAL_TYPES} from '#root/types.js';
import {IDatabase} from '#shared/database/interfaces/IDatabase.js';
import {injectable, inject} from 'inversify';
import {Db, MongoClient, Document, Collection} from 'mongodb';

/**
 * @class MongoDatabase
 * @implements {IDatabase<Db>}
 * @description A service class for managing MongoDB connections and operations.
 *
 * @example
 * const mongoDatabase = new MongoDatabase('mongodb://localhost:27017', 'myDatabase');
 *
 * @template Db
 */
@injectable()
export class MongoDatabase implements IDatabase<Db> {
  private client: MongoClient | null;
  public database: Db | null;

  /**
   * Creates an instance of MongoDatabase.
   * @param {string} uri - The MongoDB connection URI.
   * @param {string} dbName - The name of the database to connect to.
   */
  constructor(
    @inject(GLOBAL_TYPES.uri)
    private readonly uri: string,
    @inject(GLOBAL_TYPES.dbName)
    private readonly dbName: string,
  ) {
    // Skip database connection if environment variable is set
    if (process.env.SKIP_DB_CONNECTION === 'true') {
      this.client = null;
      this.database = null;
      console.log(
        'Database connection skipped due to SKIP_DB_CONNECTION environment variable',
      );
      return;
    }

    this.client = new MongoClient(uri, {
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      retryWrites: true,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000
    });
  }

  /**
   * Connects to the MongoDB database.
   * @returns {Promise<Db>} The connected database instance.
   */
  private async connect(): Promise<Db> {
    await this.client?.connect();
    this.database = this.client?.db(this.dbName) || null;
    return this.database;
  }

  /**
   * Disconnects from the MongoDB database.
   * @returns {Promise<Db | null>} The disconnected database instance, or null if already disconnected.
   */
  public async disconnect(): Promise<Db | null> {
    if (this.client) {
      await this.client.close();
      this.database = null;
    }
    return this.database;
  }

  /**
   * Checks if the database is connected.
   * @returns {boolean} True if the database is connected, false otherwise.
   */
  public isConnected(): boolean {
    return this.database !== null;
  }

  /**
   * Retrieves the client.
   * @returns {Promise<MongoClient>} The connected database instance.
   */
  public async getClient(): Promise<MongoClient> {
    return this.client;
  }

  /**
   * Retrieves a collection from the connected database.
   * @template T
   * @param {string} name - The name of the collection to retrieve.
   * @returns {Promise<Collection<T>>} The MongoDB collection.
   * @throws Will throw an error if the database is not connected.
   */
  public async getCollection<T extends Document>(
    name: string,
  ): Promise<Collection<T>> {
    if (!this.database) {
      await this.connect();
    }
    if (!this.database) {
      throw new Error('Database is not connected');
    }
    return this.database.collection<T>(name);
  }
}
