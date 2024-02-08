import { Trade } from '@org/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

export default function useTrade(tradeId?: number) {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => `trade-${tradeId}`, [tradeId]);

  const { isPending = false, data: trade = {} } = useQuery({
    queryKey: [queryKey],
    queryFn: () =>
      tradeId
        ? fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trade/${tradeId}`
          ).then((res) => res.json())
        : null,
  });

  const updateTrader = useMutation({
    mutationFn: ({ data }: { data: Partial<Trade> }) =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/trade/${tradeId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
  });

  const addTrader = useMutation({
    mutationFn: ({ data }: { data: Partial<Trade> }) =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/trade`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trades'] }),
  });

  const deleteTrader = useMutation({
    mutationFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/trade/${tradeId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trades'] }),
  });

  return {
    trade,
    isPending,
    tradeId,
    queryKey,
    updateTrader,
    addTrader,
    deleteTrader,
  };
}
