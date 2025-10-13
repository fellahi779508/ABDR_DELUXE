import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBrandDto } from './dto/createBrand.dto';
import { Serie } from 'src/serie/serie.entity';
import { NotFoundError } from 'rxjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IconService } from 'src/icon/icon.service';

export class BrandService {
  constructor(
    @InjectRepository(Brand) private readonly brandRepo: Repository<Brand>,
    private readonly iconService: IconService,
  ) {}
  async getAllBrandsOfUsedCars() {
    return await this.brandRepo.find({
      where: { series: { cars: { status: 'used' } } },
      relations: ['series', 'series.cars', 'icon'],
    });
  }
  async getAllBrandsOfNewCars() {
    return await this.brandRepo.find({
      where: { series: { cars: { status: 'new' } } },
      relations: ['series', 'series.cars', 'icon'],
    });
  }
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
    const brand = await this.brandRepo.findOne({
      where: { id },
      relations: ['icon'],
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    if (brand.icon) {
      await this.iconService.deleteIcon(brand.icon.publicId);
    }
    await this.brandRepo.delete(id);
    return 'deleted';
  }
  async GetAllBrands(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const cars = await this.brandRepo.find({
      relations: ['series', 'icon'],
      skip,
      take: limit,
    });
    return cars;
  }
  async GetBrandById(id: number) {
    const brand = await this.brandRepo.findOne({
      where: { id },
      relations: ['icon'],
    });
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
  async uploadBrandIcon(brandId: number, file: Express.Multer.File) {
    const brand = await this.GetBrandById(brandId);
    const icon = await this.iconService.addIcons(brand, file);
    brand.icon = icon;
    console.log(brand);
    return await this.brandRepo.save(brand);
  }
  async updateBrandIcon(brandId: number, file: Express.Multer.File) {
    const brand = await this.GetBrandById(brandId);
    if (brand.icon) await this.iconService.deleteIcon(brand.icon.publicId);
    const icon = await this.iconService.addIcons(brand, file);
    brand.icon = icon;
    return await this.brandRepo.save(brand);
  }
}
