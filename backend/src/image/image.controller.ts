import {
  Controller,
  Delete,
  Get,
  Param,
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
  @Get(':carId')
  getCarImages(@Param('carId', new ParseUUIDPipe()) carId: string) {
    return this.imageService.getCarImages(carId);
  }
  @Put('MakePrimary/:id')
  updateImageToPrimary(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.imageService.updateImageToPrimary(id);
  }
  @Delete('DeleteAll/:id')
  @UseGuards(AuthGuard)
  DeleteAllCarImages(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.imageService.DeleteAllCarImages(id);
  }
}
