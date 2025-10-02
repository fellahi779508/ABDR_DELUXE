import { Module } from '@nestjs/common';
import { PromoPicController } from './promoPic.controller';
import { PromoPicService } from './promoPic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PromoPic } from './promoPic.entity';
import { ImageModule } from 'src/image/image.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [PromoPicController],
  providers: [PromoPicService],
  exports: [PromoPicService],
  imports: [
    TypeOrmModule.forFeature([PromoPic]),
    JwtModule,
    ImageModule,
    CloudinaryModule,
  ],
})
export class PromoPicModule {}
