import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/createBrand.dto';
import { AuthGuard } from 'src/utils/guards/auth.guard';

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
  @Get(':id')
  getBrandById(@Param('id', ParseIntPipe) id: number) {
    return this.service.GetBrandById(id);
  }
  @Post()
  @UseGuards(AuthGuard)
  createBrand(@Body() dto: CreateBrandDto) {
    return this.service.CreateBrand(dto);
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteBrand(@Param('id', ParseIntPipe) id: number) {
    return this.service.DeleteBrand(id);
  }
}
