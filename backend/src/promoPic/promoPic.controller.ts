import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PromoPicService } from './promoPic.service';
import { CreatePromoPicDto } from './dto/promoPic.dto';
import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express/multer';
import { memoryStorage } from 'multer';
const multerOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 24 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ok = /\/(jpg|jpeg|png|webp)$/i.test(file.mimetype);
    return ok
      ? cb(null, true)
      : cb(new BadRequestException('Unsupported file type'), false);
  },
};
@Controller('promoPic')
export class PromoPicController {
  constructor(private readonly service: PromoPicService) {}
  @Get()
  getAllPromoPics() {
    return this.service.GetAllPromoPics();
  }

  @Post(':carSlug')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  createPromotion(
    @Param('carSlug') carSlug: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.CreatePromotion(carSlug, file);
  }
  @Delete(':id')
  deletePromoPicById(@Param('id') id: number) {
    return this.service.DeletePromoPicById(id);
  }
  @Delete()
  deleteAllPromoPics() {
    return this.service.DeleteAllPromoPics();
  }
}
