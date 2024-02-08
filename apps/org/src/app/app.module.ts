import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TradeModule } from './trade/trade.module';
import { BinanceModule } from './binance/binance.module';
import { AlgoModule } from './algo/algo.module';
import { EventsModule } from './events/events.module';
import { getEnvConfig } from '../environment/env-config';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      load: [getEnvConfig],
      isGlobal: true,
      cache: true,
    }),
    TradeModule,
    BinanceModule,
    AlgoModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
