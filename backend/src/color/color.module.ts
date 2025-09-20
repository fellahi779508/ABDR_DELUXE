import { Module } from '@nestjs/common';
import { ColorController } from './color.controller';
import { ColorService } from './color.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Color } from './color.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ImageModule } from 'src/image/image.module';
import { JwtModule } from '@nestjs/jwt';
import { CarModule } from 'src/car/car.module';

@Module({
  controllers: [ColorController],
  providers: [ColorService],
  exports: [ColorService],
  imports: [
    TypeOrmModule.forFeature([Color]),
    CloudinaryModule,
    ImageModule,
    JwtModule,
    CarModule,
  ],
})
export class ColorModule {}
