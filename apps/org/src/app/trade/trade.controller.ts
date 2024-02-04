import { Body, Controller, Param, Post } from '@nestjs/common';
import { of } from 'rxjs';

import { TradeService } from './trade.service';

@Controller('/trade')
export class TradeController {
  constructor(private tradeService: TradeService) { }

  @Post(':symbol')
  trade(@Param('symbol') symbol: string, @Body() body: any) {
    console.log("body", body)
    console.log("symbol", symbol)
    // TODO use the body to create a new trade on table with the conf
    // TODO integrate TypeORM  
    const intervalMs = 0.2 * 60 * 1000;
    // setInterval(() => this.tradeService.trade(symbol).subscribe(), intervalMs);
    return of({
      success: true
    });
  }
}
