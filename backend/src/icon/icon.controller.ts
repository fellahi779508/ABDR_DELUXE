import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { IconService } from './icon.service';
import { AuthGuard } from 'src/utils/guards/auth.guard';

@Controller('icon')
export class IconController {
  constructor(private readonly iconService: IconService) {}
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteIcon(@Param('id') id: string) {
    return this.iconService.deleteIcon(id);
  }
}
