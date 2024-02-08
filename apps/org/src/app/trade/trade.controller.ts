import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { catchError, from, throwError } from 'rxjs';

import { Trade } from '@org/prisma-client';

import { TradeService } from './trade.service';

@Controller('/trade')
export class TradeController {
  constructor(private tradeService: TradeService) {}

  @Post()
  trade(@Body(new ValidationPipe()) body: Trade) {
    return from(this.tradeService.createTrade(body)).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  @Get()
  getTrades() {
    return from(this.tradeService.getTrades()).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  @Patch(':id')
  updateTrade(@Param('id') id: number, @Body() body: Partial<Trade>) {
    return from(this.tradeService.updateTrade(id, body)).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  @Get(':id')
  getTrade(@Param('id') id: number) {
    return from(this.tradeService.getTrade(id)).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  @Delete(':id')
  deleteTrade(@Param('id') id: number) {
    return from(this.tradeService.deleteTrade(id)).pipe(
      catchError((error) => throwError(() => error))
    );
  }
}
