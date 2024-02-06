export type Trade = {
  id: number;
  symbol: string;
  active: boolean;
  sellQuantity: number;
  buyQuantity: number;
  interval: number;
  viewSymbol?: string;
  buyPrice?: number;
  message?: string;
  sellPrice?: number;
  userId?: number;
};
