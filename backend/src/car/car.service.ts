import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Car } from './car.entity';
import { CreateCarDto } from './dto/createCar.dto';
import { SerieService } from 'src/serie/serie.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ImageService } from 'src/image/image.service';
import { UpdateCarDto } from './dto/updateCar.dto';
import { Observable, Subject } from 'rxjs';
import slugify from 'slugify';

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
  async GetAllVisibleCars() {
    const cars = await this.carRepo.find({
      where: { isVisible: true },
      relations: ['serie', 'serie.brand', 'colors', 'colors.images', 'options'],
    });
    return cars;
  }
  async GetAllVisibleNewCarsOfSerie(serieId: number) {
    const cars = await this.carRepo.find({
      where: { isVisible: true, serie: { id: serieId }, status: 'new' },
      relations: ['serie', 'serie.brand', 'colors', 'colors.images', 'options'],
    });
    return cars;
  }
  async GetAllVisibleUsedCarsOfSerie(serieId: number) {
    const cars = await this.carRepo.find({
      where: { isVisible: true, serie: { id: serieId }, status: 'used' },
      relations: ['serie', 'serie.brand', 'colors', 'colors.images', 'options'],
    });
    return cars;
  }
  async GeAllNewCarsOfBrand(brandId: number) {
    const cars = await this.carRepo.find({
      where: {
        isVisible: true,
        serie: { brand: { id: brandId } },
        status: 'new',
      },
      relations: ['serie', 'serie.brand', 'colors', 'colors.images', 'options'],
    });
    return cars;
  }
  async GetAllVisibleNewCars() {
    const cars = await this.carRepo.find({
      where: { isVisible: true, status: 'new' },
      relations: ['serie', 'serie.brand', 'colors', 'colors.images', 'options'],
    });
    return cars;
  }
  async GetAllVisibleUsedCars() {
    const cars = await this.carRepo.find({
      where: { isVisible: true, status: 'used' },
      relations: ['serie', 'serie.brand', 'colors', 'colors.images', 'options'],
    });
    return cars;
  }
  async GeAllUsedCarsOfBrand(brandId: number) {
    const cars = await this.carRepo.find({
      where: {
        isVisible: true,
        serie: { brand: { id: brandId } },
        status: 'used',
      },
      relations: ['serie', 'serie.brand', 'colors', 'colors.images', 'options'],
    });
    return cars;
  }
  async GetAllCars(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const cars = await this.carRepo.find({
      skip,
      take: limit,
      relations: ['serie', 'serie.brand', 'colors', 'colors.images', 'options'],
    });
    return cars;
  }
  async GetCarById(id: string) {
    const car = await this.carRepo.findOne({
      where: { id },
      relations: ['serie', 'serie.brand', 'colors', 'colors.images', 'options'],
    });
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    return car;
  }
  async DeleteCar(id: string) {
    const car = await this.carRepo.findOne({
      where: { id },
      relations: ['colors', 'colors.images'],
    });
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    if (!car.colors) {
      return this.carRepo.remove(car);
    }
    car.colors.forEach(async (color) => {
      await this.ImageService.DeleteAllCarImages(color.id);
    });
    return this.carRepo.delete(id);
  }

  private carEvents$ = new Subject<{ event: string; data: any }>();

  getCarEvents(): Observable<{ event: string; data: any }> {
    return this.carEvents$.asObservable();
  }

  emitCarEvent(event: string, data: any) {
    this.carEvents$.next({ event, data });
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
      where: { slug, isVisible: true },
      relations: ['serie', 'serie.brand', 'colors', 'colors.images', 'options'],
    });
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    return car;
  }

  async updateCarById(id: string, dto: UpdateCarDto) {
    const car = await this.GetCarById(id);
    Object.assign(car, dto);
    car.slug = slugify(`${car.serie.name}-${dto.finition}`);
    return this.carRepo.save(car);
  }
  async updateCarVisibility(visibility: boolean, id: string) {
    const car = await this.GetCarById(id);
    car.isVisible = visibility;
    return this.carRepo.save(car);
  }
  async GetCarsOfSerie(id: number) {
    const cars = await this.carRepo.find({
      where: { serie: { id }, isVisible: true },
      relations: ['colors', 'colors.images', 'options', 'serie', 'serie.brand'],
    });
    if (!cars) {
      return [];
    }
    return cars;
  }
  async GetCarsOfBrand(id: number) {
    const cars = await this.carRepo.find({
      where: { serie: { brand: { id } }, isVisible: true },
      relations: ['colors', 'colors.images', 'options', 'serie', 'serie.brand'],
    });
    if (!cars) {
      return [];
    }
    return cars;
  }
  async GetAllUsedCars() {
    const cars = await this.carRepo.find({
      where: { isVisible: true, status: 'used' },
      relations: ['colors', 'colors.images', 'options', 'serie', 'serie.brand'],
    });
    if (!cars) {
      return [];
    }
    return cars;
  }
  async GetAllNewCars() {
    const cars = await this.carRepo.find({
      where: { isVisible: true, status: 'new' },
      relations: ['colors', 'colors.images', 'options', 'serie', 'serie.brand'],
    });
    if (!cars) {
      return [];
    }
    return cars;
  }
  async SearchCars(query: string) {
    const cars = await this.carRepo.find({
      where: [
        { isVisible: true, serie: { brand: { name: ILike(`%${query}%`) } } },
        { isVisible: true, serie: { name: ILike(`%${query}%`) } },
        { isVisible: true, finition: ILike(`%${query}%`) },
      ],
      relations: ['serie', 'serie.brand', 'colors', 'colors.images', 'options'],
    });

    return cars ?? [];
  }
}
