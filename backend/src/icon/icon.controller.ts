import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { IconService } from './icon.service';

@Controller('icon')
export class IconController {
  constructor(private readonly iconService: IconService) {}
  @Delete(':id')
  deleteIcon(@Param('id') id: string) {
    return this.iconService.deleteIcon(id);
  }
}
