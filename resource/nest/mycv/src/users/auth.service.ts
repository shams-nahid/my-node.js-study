import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import * as _ from 'lodash';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from './users.service';

const PASSWORD_SIZE = 32;
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    // check if email already exists
    const users = await this.usersService.find(email);
    if (_.size(users)) {
      throw new BadRequestException('Email already in use');
    }

    // generate the salt
    const salt = randomBytes(8).toString('hex');

    // hash the users password
    const hash = (await scrypt(password, salt, PASSWORD_SIZE)) as Buffer;

    // create password
    const result = `${salt}.${hash.toString('hex')}`;

    // persist the user
    const user = await this.usersService.create(email, result);

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('Invalid Credentials');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, PASSWORD_SIZE)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid Credentials');
    }
    const payload = {
      id: user.id,
    };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
