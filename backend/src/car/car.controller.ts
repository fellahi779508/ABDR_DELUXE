import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/createCar.dto';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UpdateCarDto } from './dto/updateCar.dto';
const multerOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 24 * 1024 * 1024, files: 20 },
  fileFilter: (_req, file, cb) => {
    const ok = /\/(jpg|jpeg|png|webp)$/i.test(file.mimetype);
    return ok
      ? cb(null, true)
      : cb(new BadRequestException('Unsupported file type'), false);
  },
};
@Controller('car')
export class CarController {
  constructor(private readonly service: CarService) {}

  @Post()
  @UseGuards(AuthGuard)
  CreateCar(@Body() dto: CreateCarDto) {
    return this.service.CreateCar(dto);
  }
  @Get()
  @UseGuards(AuthGuard)
  GetAllCars(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.service.GetAllCars(page, limit);
  }

  @Get('visible')
  GetAllVisibleCars() {
    return this.service.GetAllVisibleCars();
  }
  @Get('used')
  GetAllUsedCars() {
    return this.service.GetAllUsedCars();
  }

  @Get('new')
  GetAllNewCars() {
    return this.service.GetAllNewCars();
  }
  @Get('visible/new')
  GetAllVisibleNewCars() {
    return this.service.GetAllVisibleNewCars();
  }
  @Get('visible/used')
  GetAllVisibleUsedCars() {
    return this.service.GetAllVisibleUsedCars();
  }
  @Get('browse/:searchQuery')
  SearchCars(@Param('searchQuery') searchQuery: string) {
    return this.service.SearchCars(searchQuery);
  }
  @Get('new/:serieId')
  GetAllNewCarsOfSerie(@Param('serieId', ParseIntPipe) serieId: number) {
    return this.service.GetAllVisibleNewCarsOfSerie(serieId);
  }
  @Get('used/:serieId')
  GetAllUsedCarsOfSerie(@Param('serieId', ParseIntPipe) serieId: number) {
    return this.service.GetAllVisibleUsedCarsOfSerie(serieId);
  }
  @Get('new/brand/:brandId')
  GetAllNewCarsOfBrand(@Param('brandId', ParseIntPipe) brandId: number) {
    return this.service.GeAllNewCarsOfBrand(brandId);
  }
  @Get('used/brand/:brandId')
  GetAllUsedCarsOfBrand(@Param('brandId', ParseIntPipe) brandId: number) {
    return this.service.GeAllUsedCarsOfBrand(brandId);
  }

  @Get('serie/:serieId')
  getCarsOfSerie(@Param('serieId', ParseIntPipe) serieId: number) {
    return this.service.GetCarsOfSerie(serieId);
  }
  @Get('brand/:brandId')
  getCarsOfBrand(@Param('brandId', ParseIntPipe) brandId: number) {
    return this.service.GetCarsOfBrand(brandId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  GetCarById(@Param('id') id: string) {
    return this.service.GetCarById(id);
  }
  @Get('slug/:slug')
  GetCarByName(@Param('slug') slug: string) {
    return this.service.getCarBySlug(slug);
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  DeleteCar(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.DeleteCar(id);
  }

  @Put('update/:id')
  @UseGuards(AuthGuard)
  UpdateCarById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCarDto,
  ) {
    return this.service.updateCarById(id, dto);
  }

  @Put('visibility/:id/:visibility')
  @UseGuards(AuthGuard)
  updateCarVisibility(
    @Param('visibility', ParseBoolPipe) visibility: boolean,
    @Param('id') id: string,
  ) {
    return this.service.updateCarVisibility(visibility, id);
  }
}
