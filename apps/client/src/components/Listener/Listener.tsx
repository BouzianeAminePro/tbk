'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Socket, io } from 'socket.io-client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SocketEvents,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'libs/shared/src';

import EmbeddedTV from './EmbddedTV';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function Listener({ tradeId }: { tradeId: number }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const queryKey = useMemo(() => `trade-${tradeId}`, [tradeId]);

  const { isPending, data } = useQuery({
    queryKey: [queryKey],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/trade/${tradeId}`).then(
        (res) => res.json()
      ),
  });

  const queryClient = useQueryClient();

  const activateTrader = useMutation({
    mutationFn: ({ active }: { active: boolean }) => {
      return fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trade/${tradeId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            active,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then(() => (active ? joinRoom() : leaveRoom()));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
  });

  const onLogMessage = useCallback(
    (message: string) => setMessages((prev) => [...(prev ?? []), message]),
    []
  );

  const joinRoom = useCallback(
    () => socket?.emit(SocketEvents.JoinRoom, { room: data?.symbol }),
    [socket, data]
  );

  const leaveRoom = useCallback(
    () => socket?.emit(SocketEvents.LeaveRoom),
    [socket]
  );

  useEffect(() => {
    if (!data?.active) return;
    joinRoom();
  }, [data?.active, joinRoom]);

  useEffect(
    () =>
      setSocket(
        io(String(process.env.NEXT_PUBLIC_SERVER_URL), {
          autoConnect: true,
        })
      ),
    []
  );

  useEffect(() => {
    socket?.on('disconnect', leaveRoom);
    socket?.on(SocketEvents.LogMessage, onLogMessage);

    return () => {
      socket?.off('disconnect', leaveRoom);
      socket?.off(SocketEvents.LogMessage, onLogMessage);
      socket?.emit(SocketEvents.LeaveRoom);
    };
  }, [onLogMessage, socket]);

  if (isPending) return null;

  return (
    <Card className="w-[500px] h-[350px]">
      <CardHeader>
        <CardTitle className="flex gap-x-2 items-center">
          {data.active ? (
            <span className="flex h-2 w-2 rounded-full bg-emerald-700" />
          ) : (
            <span className="flex h-2 w-2 rounded-full bg-red-800" />
          )}{' '}
          {data?.symbol}
          <div className="flex gap-x-3 ml-auto">
            {/* TODO this sheet its for updating the existing trade on database */}
            <Sheet>
              <SheetTrigger>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5 3C4.67157 3 4 3.67157 4 4.5C4 5.32843 4.67157 6 5.5 6C6.32843 6 7 5.32843 7 4.5C7 3.67157 6.32843 3 5.5 3ZM3 5C3.01671 5 3.03323 4.99918 3.04952 4.99758C3.28022 6.1399 4.28967 7 5.5 7C6.71033 7 7.71978 6.1399 7.95048 4.99758C7.96677 4.99918 7.98329 5 8 5H13.5C13.7761 5 14 4.77614 14 4.5C14 4.22386 13.7761 4 13.5 4H8C7.98329 4 7.96677 4.00082 7.95048 4.00242C7.71978 2.86009 6.71033 2 5.5 2C4.28967 2 3.28022 2.86009 3.04952 4.00242C3.03323 4.00082 3.01671 4 3 4H1.5C1.22386 4 1 4.22386 1 4.5C1 4.77614 1.22386 5 1.5 5H3ZM11.9505 10.9976C11.7198 12.1399 10.7103 13 9.5 13C8.28967 13 7.28022 12.1399 7.04952 10.9976C7.03323 10.9992 7.01671 11 7 11H1.5C1.22386 11 1 10.7761 1 10.5C1 10.2239 1.22386 10 1.5 10H7C7.01671 10 7.03323 10.0008 7.04952 10.0024C7.28022 8.8601 8.28967 8 9.5 8C10.7103 8 11.7198 8.8601 11.9505 10.0024C11.9668 10.0008 11.9833 10 12 10H13.5C13.7761 10 14 10.2239 14 10.5C14 10.7761 13.7761 11 13.5 11H12C11.9833 11 11.9668 10.9992 11.9505 10.9976ZM8 10.5C8 9.67157 8.67157 9 9.5 9C10.3284 9 11 9.67157 11 10.5C11 11.3284 10.3284 12 9.5 12C8.67157 12 8 11.3284 8 10.5Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Are you absolutely sure?</SheetTitle>
                  <SheetDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <div
              className=" cursor-pointer"
              onClick={() => activateTrader.mutate({ active: !data.active })}
            >
              {data.active ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.04995 2.74998C6.04995 2.44623 5.80371 2.19998 5.49995 2.19998C5.19619 2.19998 4.94995 2.44623 4.94995 2.74998V12.25C4.94995 12.5537 5.19619 12.8 5.49995 12.8C5.80371 12.8 6.04995 12.5537 6.04995 12.25V2.74998ZM10.05 2.74998C10.05 2.44623 9.80371 2.19998 9.49995 2.19998C9.19619 2.19998 8.94995 2.44623 8.94995 2.74998V12.25C8.94995 12.5537 9.19619 12.8 9.49995 12.8C9.80371 12.8 10.05 12.5537 10.05 12.25V2.74998Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.24182 2.32181C3.3919 2.23132 3.5784 2.22601 3.73338 2.30781L12.7334 7.05781C12.8974 7.14436 13 7.31457 13 7.5C13 7.68543 12.8974 7.85564 12.7334 7.94219L3.73338 12.6922C3.5784 12.774 3.3919 12.7687 3.24182 12.6782C3.09175 12.5877 3 12.4252 3 12.25V2.75C3 2.57476 3.09175 2.4123 3.24182 2.32181ZM4 3.57925V11.4207L11.4288 7.5L4 3.57925Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
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
          <TabsContent value="logs">
            <ScrollArea className="rounded-md border h-[200px]">
              {messages.map((message: string, index: number) => (
                <p key={index} className="px-3.5">
                  {message}
                </p>
              ))}
            </ScrollArea>
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
