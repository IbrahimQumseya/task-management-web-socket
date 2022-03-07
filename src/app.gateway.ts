import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3101, {
  cors: '*:*',
  path: `/websocket`,
  serveClient: true,
  namespace: '/',
})
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger('AppGateway');

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`client discconected: ${client.id}`);
  }

  afterInit(server: Server) {
    this.logger.log('starting');
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): void {
    this.wss.emit('msgToClient', text);
    // client.emit('msgToClient', text);
    // return { event: 'msgToClient', data: text };
  }
}
