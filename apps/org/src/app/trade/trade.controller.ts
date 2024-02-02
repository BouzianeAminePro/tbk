import { Controller, Get, Param } from '@nestjs/common';
import { of } from 'rxjs';
import { TradeService } from './trade.service';

@Controller('/trade')
export class TradeController {
  constructor(private tradeService: TradeService) {}

  @Get(':symbol')
  trade(@Param('symbol') symbol: string) {
    const intervalMs = 0.2 * 60 * 1000;
    setInterval(() => this.tradeService.trade(symbol).subscribe(), intervalMs);
    return of({
      success: true
    });
  }
}
