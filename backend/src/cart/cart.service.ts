import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CreateCartDto } from './dto/createCart.dto';
import { SoldItemService } from 'src/soldItem/soldItem.service';
import { SoldItem } from 'src/soldItem/soldItem.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    private readonly soldItemService: SoldItemService,
  ) {}

  async getCartById(id: number) {
    const cart = await this.cartRepo.findOne({
      where: { id },
      relations: ['soldItem.car'],
    });
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }
  async createNewCart(dto: CreateCartDto) {
    const { soldItemId } = dto;
    const soldItems: SoldItem[] = [];
    for (const item of soldItemId) {
      const soldItem = await this.soldItemService.getSoldItemsById(item);
      soldItems.push(soldItem);
    }
    const cart = this.cartRepo.create({ soldItem: soldItems });
    return await this.cartRepo.save(cart);
  }
  async updateCartTotal(id: number) {
    const cart = await this.getCartById(id);
    cart.total = 0;
    cart.soldItem.forEach((item) => (cart.total += item.total));
    console.log('total', cart.total);
    return await this.cartRepo.save(cart);
  }
}
