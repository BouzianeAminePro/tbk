import { IEnvironment } from './env-config';

export const env: Partial<IEnvironment> = {
  production: String(process.env.ENV) === 'PROD',
  globalApiPrefix: 'api',
  port: Number(process.env.PORT),
  binance: {
    apiKey: String(process.env.BINANCE_API_KEY),
    apiBaseUrl: String(process.env.BINANCE_API_BASE_URL),
    apiSecret: String(process.env.BINANCE_API_SECRET),
  },
};
