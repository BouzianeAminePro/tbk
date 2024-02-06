import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
      .pipe(
        // TODO so how i can add this to the list of trades
        mergeMap((trade: Trade) => this.tradeService.startTrading(trade))
      )
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

  @Patch(':id')
  updateTrade(@Param('id') id: number, @Body() body: Partial<Trade>) {
    return from(this.tradeService.updateTrade(id, body)).pipe(
      catchError((error) => of(error))
    );
  }

  @Get(':id')
  getTrade(@Param('id') id: number) {
    return from(this.tradeService.getTrade(id)).pipe(
      catchError((error) => of(error))
    );
  }
}
