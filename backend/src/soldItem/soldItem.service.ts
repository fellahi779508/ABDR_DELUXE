import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoldItem } from './soldItem.entity';
import { createSoldItemDto } from './dto/createSoldItem.dto';
import { CarService } from 'src/car/car.service';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class SoldItemService {
  constructor(
    @InjectRepository(SoldItem)
    private readonly soldItemRepo: Repository<SoldItem>,
    private readonly carService: CarService,
    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,
  ) {}
  async CreateSoldItem(createSoldItemDto: createSoldItemDto) {
    const { quantity, carSlug, color } = createSoldItemDto;
    const car = await this.carService.getCarBySlug(carSlug);
    const soldItem = this.soldItemRepo.create({ quantity, car, color });
    return await this.soldItemRepo.save(soldItem);
  }
  async getSoldItemsById(id: number) {
    const soldItem = await this.soldItemRepo.findOne({
      where: { id },
      relations: ['car'],
    });
    if (!soldItem) throw new NotFoundException('SoldItem not found');
    return soldItem;
  }
  async DeleteSoldItemById(id: number) {
    const soldItem = await this.soldItemRepo.findOne({
      where: { id },
      relations: ['cart', 'cart.soldItem', 'cart.soldItem.car'],
    });
    if (!soldItem) throw new NotFoundException('SoldItem not found');
    await this.soldItemRepo.remove(soldItem);
    return this.cartService.updateCartTotal(soldItem.cart.id);
  }
  async UpdateSoldItemById(id: number, quantity: number) {
    const soldItem = await this.soldItemRepo.findOne({
      where: { id },
      relations: ['car', 'cart', 'cart.order'],
    });
    if (!soldItem) throw new NotFoundException('SoldItem not found');
    const car = await this.carService.GetCarById(soldItem.car.id);
    soldItem.quantity = quantity;
    soldItem.calculateTotal();
    await this.soldItemRepo.save(soldItem);
    return this.cartService.updateCartTotal(soldItem.cart.id);
  }
}
