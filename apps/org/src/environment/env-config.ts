import { env } from './environment';

export interface IEnvironment {
  production: boolean;
  port: number;
  baseUrl: string;
  globalApiPrefix: string;
  database: IDatabaseEnvironment;
  binance: IBinanceEnvironment;
}

export interface IBinanceEnvironment {
  apiKey: string;
  apiBaseUrl: string;
  apiSecret: string;
}

export interface IDatabaseEnvironment {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

/** Environment variables take precedence */
export function getEnvConfig() {
  const envVariables = parseEnvVariables();
  return mergeObject(env, envVariables);
}

function parseEnvVariables() {
  const envVariables: DeepPartial<IEnvironment> = {};
  const env = process.env;
  if (env) {
    if (env.PRODUCTION) envVariables.production = env.PRODUCTION === 'true';
    if (env.PORT) envVariables.port = parseInt(env.PORT, 10);
    if (env.BASE_URL) envVariables.baseUrl = env.BASE_URL;
    if (env.GLOBAL_API_PREFIX)
      envVariables.globalApiPrefix = env.GLOBAL_API_PREFIX;

    envVariables.database = {};
    if (env.DATABASE_HOST) envVariables.database.host = env.DATABASE_HOST;
    if (env.DATABASE_PORT)
      envVariables.database.port = parseInt(env.DATABASE_PORT, 10);
    if (env.DATABASE_DATABASE)
      envVariables.database.database = env.DATABASE_DATABASE;
    if (env.DATABASE_USERNAME)
      envVariables.database.username = env.DATABASE_USERNAME;
    if (env.DATABASE_PASSWORD)
      envVariables.database.password = env.DATABASE_PASSWORD;
  }
  return envVariables;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mergeObject(obj1: Record<string, any>, obj2: Record<string, any>) {
  for (const key in obj2) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj2.hasOwnProperty(key)) {
      if (typeof obj2[key] === 'object') {
        mergeObject(obj1[key], obj2[key]);
      } else {
        obj1[key] = obj2[key];
      }
    }
  }
  return obj1;
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
