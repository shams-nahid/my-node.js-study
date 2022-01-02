import { Logger } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  private logger = new Logger(User.name);

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    this.logger.log(`Inserted user with id: ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    this.logger.log(`Updated user with id: ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    this.logger.log(`Removed user with id: ${this.id}`);
  }
}
