import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { AuthGuard } from 'src/utils/guards/auth.guard';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Delete(':id')
  @UseGuards(AuthGuard)
  async removeImage(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.imageService.removeImage(id);
  }
  @Get(':colorId')
  getCarImages(@Param('colorId', ParseIntPipe) colorId: number) {
    return this.imageService.getCarImages(colorId);
  }
  @Put('MakePrimary/:id')
  updateImageToPrimary(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.imageService.updateImageToPrimary(id);
  }
  @Delete('DeleteAll/:colorId')
  @UseGuards(AuthGuard)
  DeleteAllCarImages(@Param('colorId', ParseIntPipe) colorId: number) {
    return this.imageService.DeleteAllCarImages(colorId);
  }
}
