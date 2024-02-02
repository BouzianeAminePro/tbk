import { createHmac } from 'crypto';

export const BINANCE_API_SECRET =
  'Rj4Y0vOwvqGAkNgt5eS1IMXIgvUOPKGtYytbIQj1AR7jxUoq69GSXZf2HPFDRxDR';

export function createBinanceSignature(queryString) {
  const hmac = createHmac('sha256', BINANCE_API_SECRET);
  return hmac.update(queryString).digest('hex');
}
