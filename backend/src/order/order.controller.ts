import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
  Inject, // Add this
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Status } from 'src/utils/enums';
import { AuthGuard } from '../utils/guards/auth.guard';
import { CreateOrderDto } from './dto/createOrder.dto';
import { OrderGateway } from '../websockets/order.gateway'; // Add this

@Controller('order')
export class OrderController {
  constructor(
    private readonly service: OrderService,
    @Inject(OrderGateway) private readonly orderGateway: OrderGateway, // Inject the gateway
  ) {}

  @Post()
  async createNewOrder(@Body() dto: CreateOrderDto) {
    const order = await this.service.createNewOrder(dto);

    // Emit socket event for real-time update
    this.orderGateway.emitOrderCreated(order);

    return order;
  }

  @Delete('all')
  @UseGuards(AuthGuard)
  async DeleteAllOrders() {
    return await this.service.DeleteAllOrders();
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllOrders(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return await this.service.getAllOrders(page, limit);
  }
  @Put('accept/:id')
  @UseGuards(AuthGuard)
  async acceptOrder(@Param('id', ParseUUIDPipe) id: string) {
    const order = await this.service.acceptOrder(id);

    // Emit socket event for real-time update
    this.orderGateway.emitOrderUpdated(order);

    return order;
  }

  @Put('cancel/:id')
  @UseGuards(AuthGuard)
  async cancelOrder(@Param('id', ParseUUIDPipe) id: string) {
    const order = await this.service.cancelOrder(id);

    // Emit socket event for real-time update
    this.orderGateway.emitOrderUpdated(order);

    return order;
  }

  @Put('complete/:id')
  @UseGuards(AuthGuard)
  async completeOrder(@Param('id', ParseUUIDPipe) id: string) {
    const order = await this.service.completeOrder(id);

    // Emit socket event for real-time update
    this.orderGateway.emitOrderUpdated(order);

    return order;
  }
  @Put('deliver/:id')
  @UseGuards(AuthGuard)
  async deliverOrder(@Param('id', ParseUUIDPipe) id: string) {
    const order = await this.service.deliverOrder(id);

    // Emit socket event for real-time update
    this.orderGateway.emitOrderUpdated(order);

    return order;
  }
  @Put('refund/:id')
  @UseGuards(AuthGuard)
  async refundOrder(@Param('id', ParseUUIDPipe) id: string) {
    const order = await this.service.refundOrder(id);

    // Emit socket event for real-time update
    this.orderGateway.emitOrderUpdated(order);

    return order;
  }
  @Get('search/:query')
  @UseGuards(AuthGuard)
  async searchOrders(@Param('query') query: string) {
    return await this.service.SearchOrders(query);
  }
  @Get(':id')
  @UseGuards(AuthGuard)
  async getOrderById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.service.getOrderById(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteOrder(@Param('id', ParseUUIDPipe) id: string) {
    const order = await this.service.deleteOrder(id);

    // Emit socket event for real-time update
    this.orderGateway.emitOrderDeleted(order);

    return order;
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateOrder(
    @Body() status: Status,
    @Param('id', ParseUUIDPipe) id: string, // Fixed: should be ParseUUIDPipe
  ) {
    const order = await this.service.updateOrder(status, id);

    // Emit socket event for real-time update
    this.orderGateway.emitOrderUpdated(order);

    return order;
  }
}
