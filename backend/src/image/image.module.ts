import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [ImageService],
  controllers: [ImageController],
  imports: [CloudinaryModule, TypeOrmModule.forFeature([Image]), JwtModule],
  exports: [ImageService],
})
export class ImageModule {}
