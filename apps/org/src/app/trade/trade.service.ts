import { HttpException, Injectable } from '@nestjs/common';
import {
  catchError,
  exhaustMap,
  filter,
  interval,
  map,
  mergeMap,
  of,
} from 'rxjs';

import { Trade } from '@prisma/client';

import { PrismaService } from '@org/prisma-client';

import { BinanceService } from '../binance/binance.service';
import { AlgoService } from '../algo/algo.service';

@Injectable()
export class TradeService {
  trades = {};

  constructor(
    private binanceService: BinanceService,
    private algoService: AlgoService,
    private prismaService: PrismaService
  ) {}

  async createTrade(symbol: string, trade: Trade) {
    let find = await this.prismaService.trade.findFirst({
      where: {
        symbol,
      },
    });

    if (!find) {
      find = await this.prismaService.trade.create({
        data: {
          active: true,
          symbol,
          ...trade,
        },
      });
    }

    return find;
  }

  getTrades() {
    return this.prismaService.trade.findMany();
  }

  async updateTrade(id: number, body: Partial<Trade>) {
    const trade = await this.getTrade(id);

    const result = await this.prismaService.trade.update({
      where: { id },
      data: {
        ...trade,
        ...body,
      },
    });

    if (result?.active) {
      // TODO use user.id then trade.id
      this.trades[trade.id] = this.startTrading(result).subscribe();
    } else {
      this.endTrader(result?.id);
    }

    return result;
  }

  startTrading(trade: Trade) {
    if (!trade) return of(null);

    const trader = interval(trade.interval ?? 3000).pipe(
      mergeMap(() =>
        this.binanceService.fetchHistoricalData(trade.symbol).pipe(
          exhaustMap((historicalData) => {
            const latestPrice =
              historicalData[(historicalData?.length ?? 1) - 1]?.close;
            const strategySignal =
              this.algoService.meanReversionStrategy(historicalData);
            return this.binanceService
              .isBalanceSufficient(
                trade.symbol,
                strategySignal,
                strategySignal === 'BUY'
                  ? trade.buyQuantity
                  : trade.sellQuantity,
                latestPrice
              )
              .pipe(
                filter((isBalanceSufficient) => isBalanceSufficient),
                map(() => {
                  if (strategySignal === 'BUY') {
                    return this.binanceService
                      .executeBuyOrder(
                        trade.symbol,
                        trade.buyQuantity
                        // latestPrice
                      )
                      .pipe(catchError((error) => of(error)));
                  } else if (strategySignal === 'SELL') {
                    return this.binanceService
                      .executeSellOrder(
                        trade.symbol,
                        trade.sellQuantity
                        // latestPrice
                      )
                      .pipe(catchError((error) => of(error)));
                  }
                }),
                catchError((error) => of(error))
              );
          }),
          catchError((error) => of(error))
        )
      )
    );

    return trader;
  }

  endTrader(id: number) {
    this.trades[id].unsubscribe();
  }

  async getTrade(id: number) {
    const trade = await this.prismaService.trade.findUnique({
      where: {
        id,
      },
    });

    if (!trade) throw new HttpException('No trade with this id was found', 404);

    return trade;
  }
}
