import { Module } from '@nestjs/common';

import { PrismaClientModule } from '@org/prisma-client';

import { TradeController } from './trade.controller';
import { BinanceModule } from '../binance/binance.module';
import { TradeService } from './trade.service';
import { AlgoModule } from '../algo/algo.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [BinanceModule, AlgoModule, EventsModule, PrismaClientModule],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
