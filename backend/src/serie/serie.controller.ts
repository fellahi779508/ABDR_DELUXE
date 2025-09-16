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
import { SerieService } from './serie.service';
import { CreateSerieDto } from './dto/createSerie.dto';
import { AuthGuard } from 'src/utils/guards/auth.guard';

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
  @UseGuards(AuthGuard)
  deleteSerie(@Param('id', ParseIntPipe) id: number) {
    return this.service.DeleteSerie(id);
  }
  @Post()
  @UseGuards(AuthGuard)
  createSerie(@Body() dto: CreateSerieDto) {
    return this.service.CreateSerie(dto);
  }
  @Get('brand/:id')
  getSeriesByBrandId(@Param('id', ParseIntPipe) id: number) {
    return this.service.getSeriesByBrandId(id);
  }
}
