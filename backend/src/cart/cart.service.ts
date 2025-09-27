import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
  ) {}

  async getCartById(id: number) {
    const cart = await this.cartRepo.findOne({
      where: { id },
      relations: ['soldItem'],
    });
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }
}
