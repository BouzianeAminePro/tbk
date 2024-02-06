import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { catchError, from, mergeMap, of } from 'rxjs';

import { TradeService } from './trade.service';
import { Trade } from '@prisma/client';

@Controller('/trade')
export class TradeController {
  constructor(private tradeService: TradeService) {}

  @Post(':symbol')
  trade(
    @Param('symbol') symbol: string,
    @Body(new ValidationPipe()) body: Trade
  ) {
  
    from(this.tradeService.createTrade(symbol, body))
      .pipe(mergeMap((trade: Trade) => this.tradeService.startTrading(trade)))
      .subscribe();

    return of({
      success: true,
    });
  }

  @Get()
  getTrades() {
    return from(this.tradeService.getTrades()).pipe(
      catchError((error) => of(error))
    );
  }
}
