import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TradeModule } from './trade/trade.module';
import { BinanceModule } from './binance/binance.module';
import { AlgoModule } from './algo/algo.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: String(process.env.POSTGRES_HOST),
      port: Number(process.env.POSTGRES_PORT),
      username: String(process.env.POSTGRES_USER),
      password: String(process.env.POSTGRES_PASSWORD),
      database: String(process.env.POSTGRES_DB),
      entities: ['**/*.entity{.ts}'],

      migrationsTableName: 'migration',

      // migrations: ['src/migration/*.ts'],

      // cli: {
      // migrationsDir: 'src/migration',
      // },

      ssl: Boolean(process.env.SSL)
    }),
    TradeModule,
    BinanceModule,
    AlgoModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
