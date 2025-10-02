import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express/multer';
import { memoryStorage } from 'multer';
import { AuthGuard } from 'src/utils/guards/auth.guard';
const multerOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 24 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => {
    const ok = /\/(jpg|jpeg|png|webp)$/i.test(file.mimetype);
    return ok
      ? cb(null, true)
      : cb(new BadRequestException('Unsupported file type'), false);
  },
};
@Controller('gallery')
export class GalleryController {
  constructor(private readonly service: GalleryService) {}
  @Get()
  getAllImages() {
    return this.service.GetAllImages();
  }
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  uploadImage(@UploadedFiles() files: Express.Multer.File[]) {
    return this.service.UploadImage(files);
  }
  @Delete()
  @UseGuards(AuthGuard)
  deleteAllImages() {
    return this.service.DeleteAllImages();
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteImage(@Param('id') id: number) {
    return this.service.DeleteImage(id);
  }
}
