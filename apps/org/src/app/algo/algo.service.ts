import { Injectable } from '@nestjs/common';

@Injectable()
export class AlgoService {
  meanReversionStrategy(data) {
    // Simplified Mean Reversion Strategy: Buy if the closing price is below the 20-period moving average, else sell
    const period = 20;
    const movingAverage = this.calculateMovingAverage(data, period);

    return data.close < movingAverage ? 'BUY' : 'SELL';
  }

  // Calculate Moving Average
  private calculateMovingAverage(data, period: number) {
    const closingPrices = data.slice(-period).map((item) => item.close);
    const sum = closingPrices.reduce((acc, price) => acc + price, 0);
    return sum / period;
  }
}
