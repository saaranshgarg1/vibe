import { IUserRepository } from '#shared/database/interfaces/IUserRepository.js';
import { IUser } from '#shared/interfaces/models.js';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { injectable, inject } from 'inversify';
import { Collection, MongoClient, ClientSession, ObjectId } from 'mongodb';
import { MongoDatabase } from '../MongoDatabase.js';
import { InternalServerError, NotFoundError } from 'routing-controllers';
import { GLOBAL_TYPES } from '#root/types.js';
import { User } from '#auth/classes/transformers/User.js';

@injectable()
export class UserRepository implements IUserRepository {
  private usersCollection!: Collection<IUser>;

  constructor(
    @inject(GLOBAL_TYPES.Database)
    private db: MongoDatabase,
  ) { }

  /**
   * Ensures that `usersCollection` is initialized before usage.
   */
  private async init(): Promise<void> {
    if (!this.usersCollection) {
      this.usersCollection = await this.db.getCollection<IUser>('users');
    }
  }

  async getDBClient(): Promise<MongoClient> {
    const client = await this.db.getClient();
    if (!client) {
      throw new Error('MongoDB client is not initialized');
    }
    return client;
  }

  /**
   * Creates a new user in the database.
   * - Generates a MongoDB `_id` internally but uses `firebaseUID` as the external identifier.
   */
  async create(user: IUser, session?: ClientSession): Promise<string> {
    await this.init();
    const existingUser = await this.usersCollection.findOne(
      { email: user.email },
      { session }
    );

    if (existingUser) {
      throw new Error('User already exists');
    }
    const result = await this.usersCollection.insertOne(user, { session });
    if (!result.acknowledged) {
      throw new InternalServerError('Failed to create user');
    }
    return result.insertedId.toString();
  }

  /**
   * Finds a user by email.
   */
  async findByEmail(
    email: string,
    session?: ClientSession,
  ): Promise<IUser | null> {
    await this.init();

    const user = await this.usersCollection.findOne({ email }, { session });
    return user;
  }

  /**
   * Finds a user by ID.
   */
  async findById(id: string | ObjectId): Promise<IUser | null> {
    await this.init();
    const user = await this.usersCollection.findOne({ _id: new ObjectId(id) });
    return instanceToPlain(new User(user)) as IUser;
  }

  /**
   * Finds a user by Firebase UID.
   */
  async findByFirebaseUID(
    firebaseUID: string,
    session?: ClientSession,
  ): Promise<IUser | null> {
    await this.init();
    const user = await this.usersCollection.findOne({ firebaseUID }, { session });
    return user;
  }

  /**
   * Adds a role to a user.
   */
  async makeAdmin(userId: string, session?: ClientSession): Promise<void> {
    await this.init();
    await this.usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { roles: 'admin' } },
      { session },
    );
  }

  /**
   * Updates a user's password.
   */
  async updatePassword(
    firebaseUID: string,
    password: string,
  ): Promise<IUser | null> {
    await this.init();
    const result = await this.usersCollection.findOneAndUpdate(
      { firebaseUID },
      { $set: { password } },
      { returnDocument: 'after' },
    );
    return instanceToPlain(new User(result)) as IUser;
  }

  async edit(
    userId: string,
    userData: Partial<IUser>,
    session?: ClientSession,
  ): Promise<void> {
    await this.init();
    await this.usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: userData },
      { session },
    );
  }
}
