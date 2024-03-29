import { Module } from '@nestjs/common';

import { TradeController } from './trade.controller';
import { BinanceModule } from '../binance/binance.module';
import { TradeService } from './trade.service';
import { AlgoModule } from '../algo/algo.module';
import { EventsModule } from '../events/events.module';
import { PrismaClientModule } from '../prisma/prisma.module';

@Module({
  imports: [BinanceModule, AlgoModule, EventsModule, PrismaClientModule],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
