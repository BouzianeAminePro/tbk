import dynamic from 'next/dynamic';

import { useQuery } from '@tanstack/react-query';

import { ModeToggle, Trade } from '@org/shared';

import Listener from '../components/Listener/Listener';
const AddSheet = dynamic(
  () => import('../components/Listener/Sheets/AddSheet'),
  { ssr: false }
);

export function Index() {
  const { isPending, data: trades } = useQuery({
    queryKey: ['trades'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/trade`).then((res) =>
        res.json()
      ),
  });

  if (isPending) return null;

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex gap-y-3 gap-x-2">
        <ModeToggle />
        <AddSheet />
      </div>
      <div className="flex gap-4">
        {trades?.map((trade: Trade) => (
          <Listener key={trade?.id} tradeId={trade?.id} />
        ))}
      </div>
    </div>
  );
}

export default Index;
