import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  // Emit order creation to all connected clients
  emitOrderCreated(order: any) {
    this.server.emit('orderCreated', order);
  }

  // Emit order update to all connected clients
  emitOrderUpdated(order: any) {
    this.server.emit('orderUpdated', order);
  }

  // Emit order deletion to all connected clients
  emitOrderDeleted(order: any) {
    this.server.emit('orderDeleted', order);
  }

  // Listen for client messages (optional)
  @SubscribeMessage('joinOrders')
  handleJoinOrders(client: Socket) {
    client.join('orders-room');
    return { status: 'joined orders room' };
  }

  // Get all connected clients (for admin purposes)
  getConnectedClients(): number {
    return this.connectedClients.size;
  }
}
