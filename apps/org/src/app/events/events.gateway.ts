import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';
import { EventType, ServerEvents, SocketEvents } from './events';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  public server: Server;

  // ------- Socket events ---------
  @SubscribeMessage(SocketEvents.LogMessage)
  private onLogMessage(@MessageBody() data): Promise<number> {
    return data;
  }

  @SubscribeMessage(SocketEvents.JoinRoom)
  private onJoinRoom(
    @MessageBody('room') room: string,
    @ConnectedSocket() socket: Socket
  ) {
    socket.join(room);
  }

  @SubscribeMessage(SocketEvents.LeaveRoom)
  private onLeaveRoom(
    @MessageBody('room') room: string,
    @ConnectedSocket() socket: Socket
  ) {
    socket.leave(room);
  }

  // ------- Server Messages EventEmitter ---------
  @OnEvent(ServerEvents.LogMessage)
  private onServerLogMessage(payload: EventType) {
    this.server
      .to(payload?.symbol)
      .emit(SocketEvents.LogMessage, payload.message);
  }
}
