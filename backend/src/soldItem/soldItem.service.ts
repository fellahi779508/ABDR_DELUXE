import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoldItem } from './soldItem.entity';
import { createSoldItemDto } from './dto/createSoldItem.dto';
import { CarService } from 'src/car/car.service';

@Injectable()
export class SoldItemService {
  constructor(
    @InjectRepository(SoldItem)
    private readonly soldItemRepo: Repository<SoldItem>,
    private readonly carService: CarService,
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
}
