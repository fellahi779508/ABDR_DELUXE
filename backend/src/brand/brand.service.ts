import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBrandDto } from './dto/createBrand.dto';
import { Serie } from 'src/serie/serie.entity';
import { NotFoundError } from 'rxjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export class BrandService {
  constructor(
    @InjectRepository(Brand) private readonly brandRepo: Repository<Brand>,
  ) {}
  async CreateBrand(dto: CreateBrandDto) {
    const { name } = dto;
    const brandExists = await this.brandRepo.findOne({ where: { name } });
    if (brandExists) {
      throw new BadRequestException('Brand already exists');
    }
    const brand = this.brandRepo.create({ name });
    return await this.brandRepo.save(brand);
  }
  async DeleteBrand(id: number) {
    const brand = await this.brandRepo.findOne({ where: { id } });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    await this.brandRepo.remove(brand);
    return 'deleted';
  }
  async GetAllBrands(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const cars = await this.brandRepo.find({
      relations: ['series'],
      skip,
      take: limit,
    });
    return cars;
  }
  async GetBrandById(id: number) {
    const brand = await this.brandRepo.findOne({ where: { id } });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }
  async AssignSeriesToBrand(brandId: number, series: Serie[]) {
    const brand = await this.GetBrandById(brandId);
    series.forEach((serie) => brand.series.push(serie));
    return await this.brandRepo.save(brand);
  }
  async UpdateBrand(Brand: Brand) {
    return await this.brandRepo.save(Brand);
  }
}
