import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LogginMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.time('Request-response time');

    console.log('hi from middleware');
    res.on('finish', () => console.timeEnd('Request-response time'));
    next();
  }
}
