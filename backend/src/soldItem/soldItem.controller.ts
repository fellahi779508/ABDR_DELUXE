import { Body, Controller, Post } from '@nestjs/common';
import { SoldItemService } from './soldItem.service';
import { createSoldItemDto } from './dto/createSoldItem.dto';

@Controller('soldItem')
export class SoldItemController {
  constructor(private readonly service: SoldItemService) {}
  @Post()
  async CreateSoldItem(@Body() createSoldItemDto: createSoldItemDto) {
    return await this.service.CreateSoldItem(createSoldItemDto);
  }
}
