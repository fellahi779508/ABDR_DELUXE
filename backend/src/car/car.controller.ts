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
  limits: { fileSize: 8 * 1024 * 1024, files: 20 }, // 8MB, up to 10 files
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
  // @UseGuards(AuthGuard)
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
  getAllVisibleCars() {
    return this.service.getAllVisibleCars();
  }
  @Get('serie/:serieId')
  getCarsOfSerie(@Param('serieId', ParseIntPipe) serieId: number) {
    return this.service.GetCarsOfSerie(serieId);
  }
  @Get(':id')
  GetCarById(@Param('id') id: string) {
    return this.service.GetCarById(id);
  }
  @Get('slug/:slug')
  GetCarByName(@Param('slug') slug: string) {
    return this.service.getCarBySlug(slug);
  }
  @Delete(':id')
  DeleteCar(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.DeleteCar(id);
  }
  @Post(':carId/images')
  @UseInterceptors(FilesInterceptor('files', 20, multerOptions))
  async uploadCarImages(
    @Param('carId', new ParseUUIDPipe()) carId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Query('isPrimary') isPrimary: boolean,
  ) {
    if (!files?.length) throw new BadRequestException('No files uploaded');
    return this.service.addCarImages(carId, files, isPrimary);
  }
  @Put('update/:id')
  UpdateCarById(@Param('id') id: string, @Body() dto: UpdateCarDto) {
    return this.service.updateCarById(id, dto);
  }
  @Delete('images/:id')
  removeImage(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.removeCarImage(id);
  }
  @Put('visibility/:id/:visibility')
  updateCarVisibility(
    @Param('visibility', ParseBoolPipe) visibility: boolean,
    @Param('id') id: string,
  ) {
    return this.service.updateCarVisibility(visibility, id);
  }
}
