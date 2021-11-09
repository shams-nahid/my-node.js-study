import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';

@Controller('messages')
export class MessagesController {
  @Get()
  listMessages() {}

  @Post()
  createMessage(@Body() body: CreateMessageDto) {
    console.log(`body`);
    console.log(JSON.stringify(body, null, 2));
  }

  @Get('/:id')
  getMessage(@Param('id') id: string) {
    console.log(`id: ${id}`);
  }
}
