import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Status } from 'src/utils/enums';
import { AuthGuard } from '../utils/guards/auth.guard';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Subject, Observable, map } from 'rxjs';
@Controller('order')
export class OrderController {
  constructor(private readonly service: OrderService) {}
  private orderStream$ = new Subject<any>();

  // @Post()
  // async createNewOrder(@Body() dto: CreateOrderDto) {
  //   const order = await this.service.createNewOrder(dto);
  //   this.orderStream$.next({ type: 'orderCreated', data: order });
  //   return order;
  // }

  // SSE endpoint
  @Sse('stream')
  streamOrders(): Observable<MessageEvent> {
    return this.orderStream$.pipe(
      map((event: { type: string; data: any }) => {
        return new MessageEvent(event.type, { data: event.data });
      }),
    );
  }
  @Get()
  @UseGuards(AuthGuard)
  async getAllOrders(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return await this.service.getAllOrders(page, limit);
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
    this.orderStream$.next({ type: 'orderDeleted', data: order });
    return order;
  }
  @Put(':id')
  @UseGuards(AuthGuard)
  async updateOrder(
    @Body() status: Status,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return await this.service.updateOrder(status, id);
  }
  @Put('accept/:id')
  @UseGuards(AuthGuard)
  async acceptOrder(@Param('id', ParseUUIDPipe) id: string) {
    const order = await this.service.acceptOrder(id);
    this.orderStream$.next({ type: 'orderAccepted', data: order });
    return order;
  }
  @Put('cancel/:id')
  @UseGuards(AuthGuard)
  async cancelOrder(@Param('id', ParseUUIDPipe) id: string) {
    const order = await this.service.cancelOrder(id);
    this.orderStream$.next({ type: 'orderCancelled', data: order });
    return order;
  }
  @Put('complete/:id')
  @UseGuards(AuthGuard)
  async completeOrder(@Param('id', ParseUUIDPipe) id: string) {
    const order = await this.service.completeOrder(id);
    this.orderStream$.next({ type: 'orderCompleted', data: order });
    return order;
  }
  @Get('test')
  async test(@Body() dto: CreateOrderDto) {
    return true;
  }
}
