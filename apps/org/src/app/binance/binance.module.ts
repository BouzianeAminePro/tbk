import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { BinanceService } from './binance.service';
import { env } from '../../environment/environment';

@Module({
  imports: [
    HttpModule.register({
      baseURL: env.binance.apiBaseUrl,
      headers: {
        'X-MBX-APIKEY': env.binance.apiKey,
      },
    }),
  ],
  controllers: [],
  providers: [BinanceService],
  exports: [BinanceService],
})
export class BinanceModule {}
