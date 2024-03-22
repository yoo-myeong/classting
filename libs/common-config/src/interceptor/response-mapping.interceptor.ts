import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { ResponseEntity } from '@app/common-config/res/ResponseEntity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ResponseMappingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        return instanceToPlain(ResponseEntity.successWith(data));
      }),
    );
  }
}
