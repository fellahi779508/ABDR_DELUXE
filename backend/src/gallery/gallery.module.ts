import { Module } from '@nestjs/common';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gallery } from './gallery.entity';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [GalleryController],
  providers: [GalleryService],
  exports: [GalleryService],
  imports: [TypeOrmModule.forFeature([Gallery]), JwtModule, CloudinaryModule],
})
export class GalleryModule {}
