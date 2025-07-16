import {
  ObjectIdToString,
  StringToObjectId,
} from '#shared/constants/transformerConstants.js';
import {IUser} from '#shared/interfaces/models.js';
import {Expose, Transform} from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import {ObjectId} from 'mongodb';

class User implements IUser {
  @Transform(ObjectIdToString.transformer, { toPlainOnly: true }) // ObjectId → string
  @Transform(StringToObjectId.transformer, { toClassOnly: true }) // string → ObjectId
  @Expose()
  @IsOptional()
  @JSONSchema({
    description: 'MongoDB Object ID of the user',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
    example: '60d5ec49b3f1c8e4a8f8b8c7',
  })
  _id: string | ObjectId | null;

  @Expose()
  @IsString()
  @JSONSchema({
    description: 'Firebase UID of the user',
    example: 'a1b2c3d4e5f6',
  })
  firebaseUID: string;

  @Expose()
  @IsEmail()
  @JSONSchema({
    description: 'Email address of the user',
    format: 'email',
    example: 'user@example.com',
  })
  email: string;

  @Expose()
  @IsString()
  @JSONSchema({
    description: 'First name of the user',
    example: 'John',
  })
  firstName: string;

  @Expose()
  @IsString()
  @JSONSchema({
    description: 'Last name of the user',
    example: 'Doe',
  })
  lastName: string;

  @Expose()
  @IsEnum(['admin', 'user'])
  @JSONSchema({
    description: 'Role of the user',
    enum: ['admin', 'user'],
    example: 'user',
  })
  roles: 'admin' | 'user';

  constructor(data: Partial<IUser> = {}) {
    this._id = data._id ? new ObjectId(data._id) : null;
    this.firebaseUID = data.firebaseUID ?? '';
    this.email = data.email ?? '';
    this.firstName = data.firstName ?? '';
    this.lastName = data.lastName ?? '';
    this.roles = data.roles ?? 'user';
  }
}

export {User};
