import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './image.entity';

@Module({
  providers: [ImageService],
  controllers: [ImageController],
  imports: [CloudinaryModule, TypeOrmModule.forFeature([Image])],
  exports: [ImageService],
})
export class ImageModule {}
