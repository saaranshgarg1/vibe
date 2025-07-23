import {User} from '#auth/classes/transformers/User.js';
import {UserService} from '#users/services/UserService.js';
import {USERS_TYPES} from '#users/types.js';
import {injectable, inject} from 'inversify';
import {
  JsonController,
  Get,
  HttpCode,
  Params,
  OnUndefined,
  Req,
  Body,
  Post,
  Patch,
  Authorized,
} from 'routing-controllers';
import {OpenAPI, ResponseSchema} from 'routing-controllers-openapi';
import {EditUserBody, GetUserParams, GetUserResponse, UserNotFoundErrorResponse } from '../classes/validators/UserValidators.js';
import { AUTH_TYPES } from '#root/modules/auth/types.js';
import { IAuthService } from '#root/modules/auth/interfaces/IAuthService.js';

@OpenAPI({
  tags: ['Users'],
})
@JsonController('/users', {transformResponse: true})
@injectable()
export class UserController {
  constructor(
    @inject(USERS_TYPES.UserService)
    private readonly userService: UserService,
    
    @inject(AUTH_TYPES.AuthService)
    private readonly authService: IAuthService,
  ) {}

  @OpenAPI({
    summary: 'Get user information by user ID',
    description: 'Retrieves user information based on the provided user ID.',
  })
  @Authorized()
  @Get('/:userId')
  @HttpCode(200)
  @ResponseSchema(User, {
    description: 'User information retrieved successfully',
  })
  @ResponseSchema(UserNotFoundErrorResponse, {
    description: 'User not found',
    statusCode: 404,
  })
  async getUserById(
    @Params() params: GetUserParams,
  ): Promise<GetUserResponse> {
    const { userId } = params;
    return await this.userService.getUserById(userId);
  }

  @OpenAPI({
    summary: 'Edit user information',
    description: 'Edit user information like first and last name.',
  })
  @Authorized()
  @Patch('/edit')
  @OnUndefined(200)
  @ResponseSchema(UserNotFoundErrorResponse, {
    description: 'User not found',
    statusCode: 404,
  })
  async editUser(
    @Req() req: any,
    @Body() body: EditUserBody,
  ): Promise<void> {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await this.authService.getCurrentUserFromToken(token);
    const userId = user._id.toString();
    const firebaseUID = user.firebaseUID;
    await this.userService.editUser(userId, body);
    await this.authService.updateFirebaseUser(firebaseUID, body);
  }

  @OpenAPI({
    summary: 'Make a user an admin',
    description: 'Promotes a user to admin status based on the provided user ID.',
  })
  @Authorized()
  @Post('/make-admin/:userId')
  @OnUndefined(200)
  @ResponseSchema(UserNotFoundErrorResponse, {
    description: 'User not found',
    statusCode: 404,
  })
  async makeAdmin(
    @Params() params: GetUserParams,
    @Body() body: { password: string }
  ): Promise<void> {
    const { userId } = params;
    await this.userService.makeAdmin(userId, body.password);
  }
}
