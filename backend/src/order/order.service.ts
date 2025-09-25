import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/createOrder.dto';
import { NotFoundException } from '@nestjs/common';
import { Status } from 'src/utils/enums';
import { CarService } from 'src/car/car.service';
import { Car } from 'src/car/car.entity';

export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    private readonly carService: CarService,
  ) {}
  // async createNewOrder(dto: CreateOrderDto) {
  //   const { carsId, ...rest } = dto;
  //   const cars: Car[] = [];
  //   for (const carId of carsId) {
  //     const car = await this.carService.GetCarById(carId);
  //     cars.push(car);
  //   }
  //   const order = this.orderRepo.create({
  //     ...rest,
  //   });
  //   order.cars = cars;
  //   return await this.orderRepo.save(order);
  // }

  async getAllOrders(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [orders, count] = await this.orderRepo.findAndCount({
      skip,
      take: limit,
      relations: ['cars'],
      order: { createdAt: 'DESC' },
    });
    if (count === 0) {
      return [orders, false];
    } else {
      const hasMore = count > skip + limit;
      return [orders, hasMore, count];
    }
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
