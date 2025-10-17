import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { ILike, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/createOrder.dto';
import { NotFoundException } from '@nestjs/common';
import { Status } from 'src/utils/enums';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

import { CartService } from 'src/cart/cart.service';
import { SoldItem } from 'src/soldItem/soldItem.entity';

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
      relations: [
        'cart',
        'cart.soldItem',
        'cart.soldItem.car',
        'cart.soldItem.car.colors',
        'cart.soldItem.car.colors.images',
        'cart.soldItem.car.serie',
        'cart.soldItem.car.serie.brand',
      ],
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
    const { name, phone, address, email, cartId, passport } = dto;

    // 🔍 Find the cart
    const cart = await this.cartService.getCartById(cartId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // 🔢 Find the last order to determine the next OrderCode
    const lastOrder = await this.orderRepo
      .createQueryBuilder('order')
      .orderBy('order.OrderCode', 'DESC')
      .getOne();

    let nextNumber = 1;
    if (lastOrder && lastOrder.OrderCode) {
      const parsed = parseInt(lastOrder.OrderCode, 10);
      if (!isNaN(parsed)) {
        nextNumber = parsed + 1;
      }
    }

    // 🧾 Format the OrderCode (e.g., 0001, 0002, 0003)
    const orderCode = nextNumber.toString().padStart(4, '0');

    // 🏗️ Create the order
    const order = this.orderRepo.create({
      name,
      phone,
      address,
      email,
      cart,
      passport,
      OrderCode: orderCode,
    });

    // 💾 Save it
    await this.orderRepo.save(order);

    return order.OrderCode;
  }

  async getOrderById(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['cart', 'cart.soldItem', 'cart.soldItem.car'],
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
      relations: ['cart', 'cart.soldItem', 'cart.soldItem.car'],
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
      relations: ['cart', 'cart.soldItem', 'cart.soldItem.car'],
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
      relations: ['cart', 'cart.soldItem', 'cart.soldItem.car'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = Status.COMPLETED;
    return await this.orderRepo.save(order);
  }
  async deliverOrder(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['cart', 'cart.soldItem', 'cart.soldItem.car'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = Status.DELIVERED;
    return await this.orderRepo.save(order);
  }
  async refundOrder(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['cart', 'cart.soldItem', 'cart.soldItem.car'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = Status.REFUNDED;
    return await this.orderRepo.save(order);
  }
  async DeleteAllOrders() {
    const orders = await this.orderRepo.find();
    return await this.orderRepo.remove(orders);
  }
  async SearchOrders(query: string) {
    const orders = await this.orderRepo.find({
      where: [
        { name: ILike(`%${query}%`) },
        { phone: ILike(`%${query}%`) },
        { address: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
        { OrderCode: ILike(`%${query}%`) },
      ],
      relations: [
        'cart',
        'cart.soldItem',
        'cart.soldItem.car',
        'cart.soldItem.car.colors',
        'cart.soldItem.car.colors.images',
        'cart.soldItem.car.serie',
        'cart.soldItem.car.serie.brand',
      ],
    });
    return orders;
  }

  async exportSingleOrderToExcel(id: string, res: any) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: [
        'cart',
        'cart.soldItem',
        'cart.soldItem.car',
        'cart.soldItem.car.colors',
        'cart.soldItem.car.serie',
        'cart.soldItem.car.serie.brand',
      ],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Order');

    // 🧾 Define table headers - Fixed duplicate keys
    worksheet.columns = [
      { header: 'Order Number', key: 'orderCode', width: 15 },
      { header: 'Full Name', key: 'name', width: 20 },
      { header: 'Passport Number', key: 'passport', width: 18 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone Number', key: 'phone', width: 18 },
      { header: 'Address', key: 'address', width: 25 },
      { header: 'Model Car', key: 'model', width: 25 },
      { header: 'Finition', key: 'finition', width: 15 },
      { header: 'Color', key: 'color', width: 15 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'VIN Number', key: 'vin', width: 25 },
      { header: 'Container Number', key: 'container', width: 20 },
      { header: 'Postal Number', key: 'postal', width: 20 },
      { header: 'Car Price', key: 'carPrice', width: 15 }, // Changed key
      { header: 'Global Price', key: 'globalPrice', width: 15 }, // Changed key
      { header: 'Order Status', key: 'status', width: 15 },
    ];

    let globalTotal = order.cart?.total || 0;

    // 🧠 Add only this single order's data
    if (order.cart?.soldItem?.length) {
      for (const item of order.cart.soldItem) {
        const car = item.car;
        const quantity = item.quantity || 1;
        const carPrice = item.total; // Individual car price

        worksheet.addRow({
          orderCode: order.OrderCode, // Fixed casing to match key
          name: order.name,
          passport: order.passport,
          email: order.email,
          phone: order.phone,
          address: order.address,
          model: car?.serie?.brand?.name
            ? `${car.serie.brand.name} ${car.serie.name}`
            : car?.serie?.name || 'N/A',
          finition: car?.finition || 'N/A',
          color: item.color,
          quantity: quantity.toString(),
          vin: 'N/A',
          container: 'N/A',
          postal: 'N/A',
          carPrice: carPrice.toString(), // Use the correct key
          globalPrice: globalTotal.toString(), // Use the correct key
          status: order.status || 'N/A',
        });
      }

      // 🎨 Style header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, size: 12 };
      headerRow.alignment = { horizontal: 'center', vertical: 'justify' };
      headerRow.height = 20;

      // 📥 Send file to browser
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=order_${order.OrderCode}.xlsx`,
      );

      await workbook.xlsx.write(res);
      res.end();
    }
  }
}
