import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './car.entity';
import { CreateCarDto } from './dto/createCar.dto';
import { SerieService } from 'src/serie/serie.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ImageService } from 'src/image/image.service';
import { UpdateCarDto } from './dto/updateCar.dto';

export class CarService {
  constructor(
    @InjectRepository(Car) private readonly carRepo: Repository<Car>,
    private readonly SerieService: SerieService,
    private readonly ImageService: ImageService,
  ) {}
  async CreateCar(dto: CreateCarDto) {
    const serie = await this.SerieService.GetSerieById(dto.serieId);
    const car = this.carRepo.create({ ...dto, serie });
    await this.checkIfCarExists(car);
    return await this.carRepo.save(car);
  }
  async GetAllCars(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const cars = await this.carRepo.find({
      skip,
      take: limit,
      relations: ['serie', 'serie.brand', 'images'],
    });
    return cars;
  }
  async GetCarById(id: string) {
    const car = await this.carRepo.findOne({ where: { id } });
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    return car;
  }
  async DeleteCar(id: string) {
    const car = await this.carRepo.findOne({ where: { id } });
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    return await this.carRepo.remove(car);
  }

  // this function is private
  async checkIfCarExists(car: Car) {
    const targetCar = await this.carRepo.findOne({
      where: { finition: car.finition, serie: car.serie },
    });
    if (targetCar) {
      throw new BadRequestException('Car already exists');
    }
  }
  async getCarBySlug(slug: string) {
    const car = await this.carRepo.findOne({
      where: { slug },
      relations: ['serie', 'serie.brand', 'images'],
    });
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    return car;
  }
  async addCarImages(
    carId: string,
    files: Express.Multer.File[],
    isPrimary: boolean,
  ) {
    const car = await this.carRepo.findOne({ where: { id: carId } });
    if (!car) throw new NotFoundException('Car not found');

    return this.ImageService.addImages(car, files, isPrimary);
  }
  async removeCarImage(imageId: string) {
    return this.ImageService.removeImage(imageId);
  }
  async getAllVisibleCars() {
    return this.carRepo.find({
      where: { isVisible: true },
      relations: ['images'],
    });
  }
  async updateCarById(id: string, dto: UpdateCarDto) {
    const car = await this.GetCarById(id);
    Object.assign(car, dto);
    return this.carRepo.save(car);
  }
  async updateCarVisibility(visibility: boolean, id: string) {
    const car = await this.GetCarById(id);
    car.isVisible = visibility;
    return this.carRepo.save(car);
  }
  async GetCarsOfSerie(id: number) {
    const cars = await this.carRepo.find({ where: { serie: { id } } });
    if (!cars) {
      return [];
    }
    return cars;
  }
}
