import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';

@Controller()
export class AppController {
  constructor() {}

  @Sse('sse')
  sse(payload): Observable<MessageEvent> {
    return interval(1000).pipe(map(() => ({ data: { payload } })));
  }
}
