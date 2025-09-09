import { InjectRepository } from '@nestjs/typeorm';
import { Serie } from './serie.entity';
import { Repository } from 'typeorm';
import { CreateSerieDto } from './dto/createSerie.dto';
import { NotFoundException } from '@nestjs/common';
import { BrandService } from 'src/brand/brand.service';

export class SerieService {
  constructor(
    @InjectRepository(Serie) private readonly serieRepo: Repository<Serie>,
    private readonly BrandService: BrandService,
  ) {}
  async CreateSerie(dto: CreateSerieDto) {
    const { name, brandId } = dto;
    const serieExists = await this.serieRepo.findOne({ where: { name } });
    if (serieExists) {
      throw new NotFoundException('Serie already exists');
    }
    const brand = await this.BrandService.GetBrandById(brandId);
    const serie = this.serieRepo.create({ name, brand });
    return await this.serieRepo.save(serie);
  }
  async DeleteSerie(id: number) {
    const serie = await this.serieRepo.findOne({ where: { id } });
    if (!serie) {
      throw new NotFoundException('Serie not found');
    }
    await this.serieRepo.delete(id);
    return 'deleted';
  }
  async GetAllSeries(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const series = await this.serieRepo.find({
      skip,
      take: limit,
      order: { id: 'ASC' },
    });
    return series;
  }
  async GetSerieById(id: number) {
    const serie = await this.serieRepo.findOne({ where: { id } });
    if (!serie) {
      throw new NotFoundException('Serie not found');
    }
    return serie;
  }
  async getSerieByName(name: string) {
    const serie = await this.serieRepo.findOne({ where: { name } });
    if (!serie) {
      throw new NotFoundException('Serie not found');
    }
    return serie;
  }
  async getSeriesByBrandId(id: number) {
    const series = await this.serieRepo.find({ where: { brand: { id } } });
    if (!series) {
      throw new NotFoundException('Series not found');
    }
    return series;
  }
}
