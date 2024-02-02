import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { catchError, map, of } from 'rxjs';
import { AxiosResponse } from 'axios';

import { createBinanceSignature } from './binance.helper';

@Injectable()
export class BinanceService {
  constructor(private httpService: HttpService, private eventEmitter: EventEmitter2) {}

  fetchAccountInfo() {
    const timestamp = Date.now();
    const queryString = `timestamp=${timestamp}`;
    const signature = createBinanceSignature(queryString);
    return this.httpService
      .get('/account', {
        params: {
          signature,
          timestamp,
        },
      })
      .pipe(
        map((response: AxiosResponse) => response.data),
        catchError((error) => of(error))
      );
  }

  fetchHistoricalData(symbol: string, interval = '1h', limit = 100) {
    return this.httpService
      .get('/klines', {
        params: {
          symbol,
          interval,
          limit,
        },
      })
      .pipe(
        map((response: AxiosResponse) =>
          response.data.map((item: Array<number | string>) => ({
            timestamp: new Date(item[0]),
            open: parseFloat(`${item[1]}`),
            high: parseFloat(`${item[2]}`),
            low: parseFloat(`${item[3]}`),
            close: parseFloat(`${item[4]}`),
            volume: parseFloat(`${item[5]}`),
          }))
        ),
        catchError((error) => of(error))
      );
  }

  isBalanceSufficient(
    symbol: string,
    strategySignal: string,
    quantity: number,
    price: number
  ) {
    return this.fetchAccountInfo().pipe(
      map(
        (response) => {
          const balance = response.balances.find(
            (b) => b.asset === symbol.substring(0, b.asset.length)
          );

          if (
            !balance ||
            (strategySignal === 'BUY' &&
              parseFloat(balance.free) < quantity * price) ||
            (strategySignal === 'SELL' && parseFloat(balance.free) < quantity)
          ) {
            const insufficientText = `Insufficient balance for the order. Skipping this : ${symbol} - ${strategySignal} - ${quantity} - ${price}`;
            this.eventEmitter.emit('test', { symbol, message: insufficientText });
            console.log(insufficientText);
            return false;
          }

          return true;
        },
        catchError((error) => of(error))
      )
    );
  }

  executeSellOrder(
    symbol: string,
    quantity: number
    // price: number
  ) {
    const timestamp = Date.now();
    const side = 'SELL';
    const type = 'MARKET';

    const queryString = `symbol=${symbol}&side=${side}&type=${type}&quantity=${quantity}&timestamp=${timestamp}`;
    const signature = createBinanceSignature(queryString);

    return this.httpService
      .post(`/order?${queryString}`, null, {
        params: {
          signature,
        },
      })
      .pipe(
        map((response: AxiosResponse) => {
          // Store transaction in the database
          // await storeTransaction(symbol, 'SELL', quantity, price);
          console.log(`Sell order executed: ${JSON.stringify(response.data)}`);
          return !!response?.data;
        }),
        catchError((error) => of(error))
      );
  }

  executeBuyOrder(
    symbol: string,
    quantity: number
    // price: number
  ) {
    const timestamp = Date.now();
    const side = 'BUY';
    const type = 'MARKET';

    const queryString = `symbol=${symbol}&side=${side}&type=${type}&quantity=${quantity}&timestamp=${timestamp}`;
    const signature = createBinanceSignature(queryString);
    return this.httpService
      .post(`/order?${queryString}`, null, {
        params: {
          signature,
        },
      })
      .pipe(
        map((response: AxiosResponse) => {
          // Store transaction in the database
          // await storeTransaction(symbol, 'BUY', quantity, price);
          console.log(`Buy order executed: ${JSON.stringify(response.data)}`);
          return !!response.data;
        })
      );
  }
}
