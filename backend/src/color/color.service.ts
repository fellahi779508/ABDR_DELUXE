import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Color } from './color.entity';
import { Repository } from 'typeorm';
import { CreateColorDto } from './dto/createColor.dto';
import { ImageService } from 'src/image/image.service';
import { CarService } from 'src/car/car.service';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color) private readonly colorRepo: Repository<Color>,
    private readonly ImageService: ImageService,
    private readonly carService: CarService,
  ) {}
  async CreateColor(dto: CreateColorDto) {
    const { CarId } = dto;
    const car = await this.carService.GetCarById(CarId);
    if (!car) throw new NotFoundException('Car not found');

    const color = this.colorRepo.create({ ...dto, cars: car }); // attach the entity here
    return await this.colorRepo.save(color);
  }

  async getImagesByColorId(id: number) {
    return await this.colorRepo.find({ where: { id }, relations: ['images'] });
  }

  async removeColor(id: number) {
    const color = await this.colorRepo.findOne({
      where: { id },
      relations: ['images', 'cars'],
    });
    if (!color) throw new NotFoundException('Color not found');
    await this.ImageService.DeleteAllCarImages(color.id);
    return await this.colorRepo.delete(id);
  }
  async addCarImages(
    colorId: number,
    files: Express.Multer.File[],
    isPrimary: boolean,
  ) {
    const color = await this.colorRepo.findOne({ where: { id: colorId } });
    if (!color) throw new NotFoundException('color not found');

    return this.ImageService.addImages(color, files, isPrimary);
  }

  async removeCarImage(imageId: string) {
    return this.ImageService.removeImage(imageId);
  }
  async getColorById(id: number) {
    const color = await this.colorRepo.findOne({
      where: { id },
      relations: ['images', 'cars'],
    });
    if (!color) throw new NotFoundException('Color not found');
    return color;
  }
  async UpdateColorName(id: number, name: string) {
    const color = await this.colorRepo.findOne({ where: { id } });
    if (!color) throw new NotFoundException('Color not found');
    color.name = name;
    return await this.colorRepo.save(color);
  }
}
