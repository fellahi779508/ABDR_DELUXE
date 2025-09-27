import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/createOrder.dto';
import { NotFoundException } from '@nestjs/common';
import { Status } from 'src/utils/enums';

import { CartService } from 'src/cart/cart.service';

export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    private readonly cartService: CartService,
  ) {}

  async getAllOrders(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [orders, count] = await this.orderRepo.findAndCount({
      skip,
      take: limit,
      relations: ['cart', 'cart.soldItem', 'cart.soldItem.car'],
      order: { createdAt: 'DESC' },
    });
    if (count === 0) {
      return [orders, false];
    } else {
      const hasMore = count > skip + limit;
      return [orders, hasMore, count];
    }
  }

  async createNewOrder(dto: CreateOrderDto) {
    const { name, phone, address, email, cartId } = dto;
    const cart = await this.cartService.getCartById(cartId);
    const order = this.orderRepo.create({
      name,
      phone,
      address,
      email,
      cart,
    });
    return await this.orderRepo.save(order);
  }
  async getOrderById(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['cars'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
  async deleteOrder(id: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return this.orderRepo.remove(order);
  }
  async updateOrder(status: Status, id: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = status;
    return await this.orderRepo.save(order);
  }
  async acceptOrder(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['cars'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = Status.PENDING;
    return await this.orderRepo.save(order);
  }
  async cancelOrder(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['cars'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = Status.CANCELLED;
    return await this.orderRepo.save(order);
  }
  async completeOrder(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['cars'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = Status.COMPLETED;
    return await this.orderRepo.save(order);
  }
}
