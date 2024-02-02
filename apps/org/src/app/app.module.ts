import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TradeModule } from './trade/trade.module';
import { BinanceModule } from './binance/binance.module';
import { AlgoModule } from './algo/algo.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [TradeModule, BinanceModule, AlgoModule, EventsModule, EventEmitterModule.forRoot()  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
