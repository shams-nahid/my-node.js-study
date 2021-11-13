import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as _ from 'lodash';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.header('authorization').replace('Bearer ', '');
    console.log('accessToken');
    console.log(accessToken);
    const payload = this.jwtService.decode(accessToken);
    console.log('payload');
    console.log(payload);
    if (payload['id']) {
      const user = await this.userService.findOne(payload['id']);
      request.currentUser = !_.isEmpty(user)
        ? _.pick(user, ['id', 'email'])
        : null;
    }
    return handler.handle();
  }
}
