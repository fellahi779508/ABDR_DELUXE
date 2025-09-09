import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/createOrder.dto';
import { NotFoundException } from '@nestjs/common';
import { Status } from 'src/utils/enums';
import { CarService } from 'src/car/car.service';

export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    private readonly carService: CarService,
  ) {}
  async createNewOrder(dto: CreateOrderDto) {
    const { carId, ...rest } = dto;

    const car = await this.carService.GetCarById(carId);
    if (!car) throw new NotFoundException('Car not found');

    const order = this.orderRepo.create({
      ...rest,
      cars: car, // attach the entity here
    });

    return await this.orderRepo.save(order);
  }

  async getAllOrders(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await this.orderRepo.find({
      skip,
      take: limit,
      relations: ['cars'],
    });
  }
  async getOrderById(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['cars'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
  async deleteOrder(id: number) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return await this.orderRepo.remove(order);
  }
  async updateOrder(status: Status, id: number) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = status;
    return await this.orderRepo.save(order);
  }
}
