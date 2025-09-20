import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/createColor.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { memoryStorage } from 'multer';
const multerOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 24 * 1024 * 1024, files: 20 },
  fileFilter: (_req, file, cb) => {
    const ok = /\/(jpg|jpeg|png|webp)$/i.test(file.mimetype);
    return ok
      ? cb(null, true)
      : cb(new BadRequestException('Unsupported file type'), false);
  },
};
@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Get(':id')
  async getColorById(@Param('id', new ParseIntPipe()) id: number) {
    return this.colorService.getColorById(id);
  }
  @Post()
  @UseGuards(AuthGuard)
  async createColor(@Body() dto: CreateColorDto) {
    return this.colorService.CreateColor(dto);
  }
  @Delete(':colorId')
  @UseGuards(AuthGuard)
  async removeColor(@Param('colorId', new ParseIntPipe()) colorId: number) {
    return this.colorService.removeColor(colorId);
  }
  @Put(':colorId')
  @UseGuards(AuthGuard)
  async UpdateColorName(
    @Param('colorId', new ParseIntPipe()) colorId: number,
    @Body('name') name: string,
  ) {
    return this.colorService.UpdateColorName(colorId, name);
  }

  @Post(':colorId/images')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files', 20, multerOptions))
  async uploadCarImages(
    @Param('colorId', new ParseIntPipe()) colorId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Query('isPrimary') isPrimary: boolean,
  ) {
    if (!files?.length) throw new BadRequestException('No files uploaded');
    return this.colorService.addCarImages(colorId, files, isPrimary);
  }

  @Delete(':colorId/images/:imageId')
  @UseGuards(AuthGuard)
  async removeCarImage(@Param('imageId') imageId: string) {
    return this.colorService.removeCarImage(imageId);
  }
}
