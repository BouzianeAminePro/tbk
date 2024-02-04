import { Injectable } from '@nestjs/common';
import { catchError, exhaustMap, filter, map, of } from 'rxjs';

import { BinanceService } from '../binance/binance.service';
import { AlgoService } from '../algo/algo.service';

@Injectable()
export class TradeService {
  constructor(
    private binanceService: BinanceService,
    private algoService: AlgoService
  ) { }

  trade(symbol: string) {
    const quantity = 15

    return this.binanceService.fetchHistoricalData(symbol).pipe(
      exhaustMap((historicalData) => {
        const latestPrice =
          historicalData[(historicalData?.length ?? 1) - 1]?.close;
        const strategySignal =
          this.algoService.meanReversionStrategy(historicalData);
        return this.binanceService
          .isBalanceSufficient(symbol, strategySignal, quantity, latestPrice)
          .pipe(
            filter((isBalanceSufficient) => isBalanceSufficient),
            map(() => {
              if (strategySignal === 'BUY') {
                return this.binanceService
                  .executeBuyOrder(
                    symbol,
                    quantity
                    // latestPrice
                  )
                  .pipe(catchError((error) => of(error)));
              } else if (strategySignal === 'SELL') {
                return this.binanceService
                  .executeSellOrder(
                    symbol,
                    quantity
                    // latestPrice
                  )
                  .pipe(catchError((error) => of(error)));
              }

              console.log(
                `${strategySignal} - ${symbol} - ${quantity} - ${latestPrice}`
              );
            }),
            catchError((error) => of(error))
          );
      }),
      catchError((error) => of(error))
    );
  }
}
