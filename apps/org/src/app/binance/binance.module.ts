import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { BinanceService } from './binance.service';

const BINANCE_API_BASE_URL = 'https://api.binance.com/api/v3';
const BINANCE_API_KEY =
  'l66j1mzKDFNlOS3Zt6QHzwjbD8TCRZbqhsqV2z5FoKP7wk8Bik8ttFFbgy6tPAfB';

@Module({
  imports: [
    HttpModule.register({
      baseURL: BINANCE_API_BASE_URL,
      headers: {
        'X-MBX-APIKEY': BINANCE_API_KEY,
      },
    }),
  ],
  controllers: [],
  providers: [BinanceService],
  exports: [BinanceService],
})
export class BinanceModule {}
