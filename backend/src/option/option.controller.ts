import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OptionService } from './option.service';
import { CreateOptionDto } from './dto/createOption.dto';
import { UpdateoptionDto } from './dto/updateOption.dto';
import { AuthGuard } from 'src/utils/guards/auth.guard';

@Controller('option')
export class OptionController {
  constructor(private readonly service: OptionService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createOption(@Body() dto: CreateOptionDto) {
    return this.service.CreateOption(dto);
  }
  @Put('/:optionId')
  @UseGuards(AuthGuard)
  async updateOption(
    @Param('optionId', ParseIntPipe) optionId: number,
    @Body() dto: UpdateoptionDto,
  ) {
    return this.service.UpdateOption(optionId, dto);
  }
  @Get('/:carId')
  @UseGuards(AuthGuard)
  async getOption(@Param('carId', ParseUUIDPipe) carId: string) {
    return this.service.GetAllOptionsOfCar(carId);
  }
  @Delete('/:optionId')
  @UseGuards(AuthGuard)
  async removeOption(@Param('optionId', ParseIntPipe) optionId: number) {
    return this.service.removeOption(optionId);
  }
}
