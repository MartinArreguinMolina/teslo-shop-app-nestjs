import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload-interfaces';


@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect{
  // Sabe todo sobre los clientes
  @WebSocketServer() wss: Server;


  constructor(
    private readonly messagesWsService: MessagesWsService,

    private readonly jwtService: JwtService
  ) {}

  handleDisconnect(client: Socket) {
    // console.log('Cliente conectado', client.id)
    this.messagesWsService.removeClient(client.id);


    // Mandamos todos los clientes conectados
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())

    // console.log({conectados: this.messagesWsService.getConnectedClients()})
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try{
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id)
    }catch(error){
      client.disconnect()
      return;
    }

    // console.log({payload})

    // console.log({token})
    // console.log('Cliente desconectado', client.id)

    // Mandamos todos los clientes conectados
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())

    // console.log({conectados: this.messagesWsService.getConnectedClients()})
  }

  // message-from-client
  // Escuchar al cliente
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto){


    // Emite unicamente al cliente.
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message!!'
    // })
    
    // Emite unicamente a todos menos al cliente inicial.
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message!!'
    // })
    
    // Emite a todos los clientes.
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!'
    })

  }

}
