import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SerializeInterceptor.name);

  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    this.logger.log('Before the request is being handled');
    return handler.handle().pipe(
      map((data: any) => {
        this.logger.log('After the request is being handled: ', { data });
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
