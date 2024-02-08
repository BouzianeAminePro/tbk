import { SocketEvents } from '@org/shared';
import { useCallback, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

export default function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const onLogMessage = useCallback(
    (message: string) => setMessages((prev) => [...(prev ?? []), message]),
    []
  );

  const joinRoom = useCallback(
    (symbol: string) => socket?.emit(SocketEvents.JoinRoom, { room: symbol }),
    [socket]
  );

  const leaveRoom = useCallback(
    (symbol: string) => socket?.emit(SocketEvents.LeaveRoom, { room: symbol }),
    [socket]
  );

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
  }, [onLogMessage, socket, leaveRoom]);

  return {
    leaveRoom,
    joinRoom,
    messages,
    setMessages,
    socket,
  };
}
