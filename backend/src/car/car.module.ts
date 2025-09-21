import { Module } from '@nestjs/common';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './car.entity';
import { SerieModule } from 'src/serie/serie.module';
import { JwtModule } from '@nestjs/jwt';
import { ImageModule } from 'src/image/image.module';

@Module({
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService],
  imports: [
    TypeOrmModule.forFeature([Car]),
    SerieModule,
    JwtModule,
    ImageModule,
  ],
})
export class CarModule {}
