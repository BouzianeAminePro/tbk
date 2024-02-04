'use client';

import dynamic from 'next/dynamic';

import { PlusIcon } from "@radix-ui/react-icons"

import { Button, ModeToggle } from '@org/shared';

const Listener = dynamic(() => import('../components/Listener'), {
  ssr: false
});

export function Index() {
  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex gap-y-3 gap-x-2">
        <ModeToggle />
        {/* TODO to add new SYMBOL (trade) on database */}
        <Button variant="outline" size="icon">
          <PlusIcon />
        </Button>
      </div>
      <div className="flex gap-4">
        <Listener symbol="ADAUSDT" viewSymbol="ADA/USDT" />
        <Listener symbol="MATICUSDT" viewSymbol="MATIC/USDT" />
      </div>
    </div >
  );
}

export default Index;
