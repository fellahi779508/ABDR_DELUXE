import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOptionDto } from './dto/createOption.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from './option.entity';
import { CarService } from 'src/car/car.service';
@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(Option)
    private readonly optionRepo: Repository<Option>,
    private readonly carService: CarService,
  ) {}
  async GetOptionById(id: number) {
    const option = await this.optionRepo.findOne({ where: { id } });
    if (!option) {
      throw new NotFoundException('Option not found');
    }
    return option;
  }
  async CreateOption(dto: CreateOptionDto) {
    const { CarId, title, value } = dto;
    const car = await this.carService.GetCarById(CarId);
    const option = this.optionRepo.create({ title, value, car });
    return await this.optionRepo.save(option);
  }
  async GetAllOptionsOfCar(carId: string) {
    return await this.optionRepo.find({ where: { car: { id: carId } } });
  }
  async removeOption(optionId: number) {
    const option = await this.GetOptionById(optionId);
    return await this.optionRepo.remove(option);
  }
  async UpdateOption(optionId: number, title: string, value: string) {
    const option = await this.GetOptionById(optionId);
    option.title = title ?? option.title;
    option.value = value ?? option.value;
    return await this.optionRepo.save(option);
  }
}
