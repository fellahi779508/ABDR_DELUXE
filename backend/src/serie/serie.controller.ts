import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { SerieService } from './serie.service';
import { CreateSerieDto } from './dto/createSerie.dto';

@Controller('serie')
export class SerieController {
  constructor(private readonly service: SerieService) {}
  @Get()
  getAllSeries(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.service.GetAllSeries(page, limit);
  }
  @Get(':id')
  getSerieById(@Param('id', ParseIntPipe) id: number) {
    return this.service.GetSerieById(id);
  }
  @Delete(':id')
  deleteSerie(@Param('id', ParseIntPipe) id: number) {
    return this.service.DeleteSerie(id);
  }
  @Post()
  createSerie(@Body() dto: CreateSerieDto) {
    return this.service.CreateSerie(dto);
  }
  @Get('brand/:id')
  getSeriesByBrandId(@Param('id', ParseIntPipe) id: number) {
    return this.service.getSeriesByBrandId(id);
  }
}
