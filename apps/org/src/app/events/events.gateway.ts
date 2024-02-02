import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { Events } from './events';

type EventType = {
  symbol: string;
  message?: string;
};

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class EventsGateway {
  constructor(private eventEmitter: EventEmitter2) {}

  @WebSocketServer()
  public server: Server;

  @SubscribeMessage('events')
  private findAll(): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item }))
    );
  }

  @SubscribeMessage('identity')
  private async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @SubscribeMessage(Events.Test)
  private test(
    @MessageBody() data,
    @ConnectedSocket() socket: Socket
  ): Promise<number> {
    console.log('socket', socket);
    console.log('data', data);
    return data;
  }

  @SubscribeMessage(Events.JoinRoom)
  private joinRoom(
    @MessageBody('room') room: string,
    @ConnectedSocket() socket: Socket
  ) {
    console.log(room);
    socket.join(room);
  }

  @OnEvent('test')
  onTest(payload: EventType) {
    this.server.to(payload?.symbol).emit(Events.Test, payload.message);
  }

  @SubscribeMessage(Events.LeaveRoom)
  private leaveRoom(
    @MessageBody('room') room: string,
    @ConnectedSocket() socket: Socket
  ) {
    socket.leave(room);
  }
}
