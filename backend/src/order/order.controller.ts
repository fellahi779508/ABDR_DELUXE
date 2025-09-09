import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Status } from 'src/utils/enums';
import { AuthGuard } from '../utils/guards/auth.guard';
@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly service: OrderService) {}
  @Get()
  async getAllOrders(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return await this.service.getAllOrders(page, limit);
  }
  @Get(':id')
  async getOrderById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.getOrderById(id);
  }
  @Delete(':id')
  async deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return await this.service.deleteOrder(id);
  }
  @Put(':id')
  async updateOrder(
    @Body() status: Status,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.service.updateOrder(status, id);
  }
}
