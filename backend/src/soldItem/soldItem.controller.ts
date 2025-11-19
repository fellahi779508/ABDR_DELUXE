import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SoldItemService } from './soldItem.service';
import { createSoldItemDto } from './dto/createSoldItem.dto';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { parse } from 'path';

@Controller('soldItem')
export class SoldItemController {
  constructor(private readonly service: SoldItemService) {}
  @Post()
  async CreateSoldItem(@Body() createSoldItemDto: createSoldItemDto) {
    return await this.service.CreateSoldItem(createSoldItemDto);
  }
  @Put(':id')
  @UseGuards(AuthGuard)
  async UpdateSoldItemById(
    @Param('id', ParseIntPipe) id: number,
    @Query('quantity', ParseIntPipe) quantity: number,
  ) {
    return await this.service.UpdateSoldItemById(id, quantity);
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  async DeleteSoldItemById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.DeleteSoldItemById(id);
  }
}
