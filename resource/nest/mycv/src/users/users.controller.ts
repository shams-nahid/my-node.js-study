import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/protected')
  @UseGuards(AuthGuard())
  protectedRoute() {
    return 'Access Confirmed';
  }

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.logger.log('Got new data', body);
    const { email, password } = body;
    return this.authService.signup(email, password);
  }

  @Post('/signin')
  singin(@Body() body: CreateUserDto) {
    this.logger.log('Got logged in data ', body);
    const { email, password } = body;
    return this.authService.signin(email, password);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found!`);
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
