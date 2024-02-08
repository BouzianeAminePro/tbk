import { createHmac } from 'crypto';
import { env } from '../../environment/environment';

export function createBinanceSignature(queryString) {
  const hmac = createHmac('sha256', env.binance.apiSecret);
  return hmac.update(queryString).digest('hex');
}
