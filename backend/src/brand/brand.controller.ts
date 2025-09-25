import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/createBrand.dto';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { memoryStorage } from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
const multerOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 24 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ok = /\/(jpg|jpeg|png|webp)$/i.test(file.mimetype);
    return ok
      ? cb(null, true)
      : cb(new BadRequestException('Unsupported file type'), false);
  },
};
@Controller('brand')
export class BrandController {
  constructor(private readonly service: BrandService) {}

  @Get()
  getAllBrands(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.service.GetAllBrands(page, limit);
  }
  @Post()
  @UseGuards(AuthGuard)
  createBrand(@Body() dto: CreateBrandDto) {
    return this.service.CreateBrand(dto);
  }
  @Post('icons/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadBrandIcon(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.service.uploadBrandIcon(id, file);
  }

  @Get('UsedCars')
  getAllBrandsOfUsedCars() {
    return this.service.getAllBrandsOfUsedCars();
  }
  @Get('NewCars')
  getAllBrandsOfNewCars() {
    return this.service.getAllBrandsOfNewCars();
  }
  @Get(':id')
  getBrandById(@Param('id', ParseIntPipe) id: number) {
    return this.service.GetBrandById(id);
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteBrand(@Param('id', ParseIntPipe) id: number) {
    return this.service.DeleteBrand(id);
  }
}
