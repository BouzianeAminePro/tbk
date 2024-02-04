'use client';

import { useCallback, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { Button } from '@org/shared';

export default function Listener({ symbol }: { symbol: string }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(socket?.connected);
  const [messages, setMessages] = useState<string[]>([]);

  const onConnect = useCallback(() => setIsConnected(true), []);

  const onDisconnect = useCallback(() => setIsConnected(false), []);

  const onListenTo = useCallback(
    () =>
      fetch(`http://localhost:3000/api/trade/${symbol}`).then(() =>
        socket?.emit('JoinRoom', { room: symbol })
      ),
    [symbol, socket]
  );

  const onFooEvent = useCallback(
    (message: string) => setMessages((prev) => [...(prev ?? []), message]),
    []
  );

  useEffect(() => {
    setSocket(
      io('http://localhost:3000', {
        autoConnect: true
      })
    );
  }, []);

  useEffect(() => {
    socket?.on('connect', onConnect);
    socket?.on('disconnect', onDisconnect);
    socket?.on('Test', onFooEvent);

    return () => {
      socket?.off('connect', onConnect);
      socket?.off('disconnect', onDisconnect);
      socket?.off('foo', onFooEvent);
    };
  }, [onConnect, onDisconnect, onFooEvent, socket]);

  return (
    <div>
      <p>State: {'' + isConnected}</p>
      <Button variant="default" onClick={onListenTo}>
        Start trading on {symbol}
      </Button>
      <h1>Logs of: {symbol}</h1>
      <div>
        {messages.map((message: string, index: number) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
}
