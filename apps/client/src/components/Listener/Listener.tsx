import { useCallback, useEffect } from 'react';

import {
  PauseIcon,
  PlayIcon,
  ResetIcon,
  TrashIcon,
} from '@radix-ui/react-icons';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useToast,
} from '@org/shared';

import useTrade from '../../hooks/useTrade';
import useSocket from '../../hooks/useSocket';
import UpdateSheet from './Sheets/UpdateSheet';
import Logs from './Tabs/Logs';
import EmbeddedTV from './Tabs/EmbddedTV';

export default function Listener({ tradeId }: { tradeId: number }) {
  const { toast } = useToast();
  const {
    trade: data,
    isPending,
    updateTrader,
    deleteTrader,
  } = useTrade(tradeId);
  const { joinRoom, leaveRoom, messages, setMessages } = useSocket();

  useEffect(() => {
    if (!data?.active) return;
    joinRoom(data.symbol);
  }, [data?.active, joinRoom, data?.symbol]);

  const stopRunTrader = useCallback(
    () =>
      updateTrader
        .mutateAsync({
          data: {
            active: !data.active,
          },
        })
        .then(() => {
          !data.active ? joinRoom(data?.symbol) : leaveRoom(data?.symbol);
          toast({
            title: 'Information',
            description: !data.active
              ? `Trading on ${data?.symbol} started successfully`
              : `Trading on ${data?.symbol} stopped successfully`,
          });
        }),
    [updateTrader, joinRoom, leaveRoom, data?.active, data?.symbol, toast]
  );

  const onDeleteTrader = useCallback(
    () =>
      deleteTrader.mutateAsync().then(() =>
        toast({
          title: 'Information',
          description: 'Trader deleted successfully',
        })
      ),
    [deleteTrader, toast]
  );
  const clearMessages = useCallback(() => setMessages([]), [setMessages]);

  if (isPending) return null;

  return (
    <Card className="w-[500px] h-[370px]">
      <CardHeader>
        <CardTitle className="flex gap-x-2 items-center">
          {data.active ? (
            <span className="flex h-2 w-2 rounded-full bg-emerald-700" />
          ) : (
            <span className="flex h-2 w-2 rounded-full bg-red-800" />
          )}
          <span>{data?.symbol}</span>
          <div className="flex gap-x-3 ml-auto">
            <div className="cursor-pointer" onClick={onDeleteTrader}>
              <TrashIcon />
            </div>
            <UpdateSheet tradeId={tradeId} />
            <div className=" cursor-pointer" onClick={stopRunTrader}>
              {data.active ? <PauseIcon /> : <PlayIcon />}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="logs" className="w-[450px]">
          <TabsList>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="logs" className="flex flex-col gap-y-1.5">
            <div className="ml-auto">
              <Button variant="outline" size="icon" onClick={clearMessages}>
                <ResetIcon />
              </Button>
            </div>
            <Logs messages={messages} />
          </TabsContent>
          <TabsContent value="chart">
            <div className="h-[200px]">
              <EmbeddedTV viewSymbol={data?.viewSymbol} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
