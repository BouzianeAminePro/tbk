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

import { PrismaService, Trade } from '@org/prisma-client';

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

  async createTrade(trade: Trade) {
    let find = await this.prismaService.trade.findFirst({
      where: {
        symbol: trade.symbol,
      },
    });

    if (find) {
      return new HttpException(
        'Trader with this symbol is already running',
        409
      );
    }

    find = await this.prismaService.trade.create({
      data: trade,
    });

    this.startOrEndTrader(find);

    return find;
  }

  async getTrades() {
    return await this.prismaService.trade.findMany({
      orderBy: {
        id: 'desc',
      },
    });
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
      this.startOrEndTrader(result);
    } else {
      this.endTrader(result?.id);
    }

    return result;
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

  async deleteTrade(id: number) {
    const trade = await this.prismaService.trade.findUnique({
      where: {
        id,
      },
    });

    if (!trade) throw new HttpException('No trade with this id was found', 404);

    this.endTrader(id);

    return await this.prismaService.trade.delete({
      where: { id },
    });
  }

  private launchTrade(trade: Trade) {
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

  private endTrader(id: number) {
    if (id in this.trades) {
      this.trades[id].unsubscribe();
      delete this.trades[id];
    }
  }

  private startTrader(trade: Trade) {
    const trader = this.trades[trade.id];
    if (trader) return;
    // TODO use user.id then trade.id
    // TODO use clerk
    this.trades[trade.id] = this.launchTrade(trade).subscribe();
  }

  private startOrEndTrader(trade: Trade) {
    if (!trade?.active) {
      return this.endTrader(trade.id);
    }

    return this.startTrader(trade);
  }
}
