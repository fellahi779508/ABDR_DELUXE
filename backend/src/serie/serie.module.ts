import { Module } from '@nestjs/common';
import { SerieService } from './serie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Serie } from './serie.entity';
import { SerieController } from './serie.controller';
import { BrandModule } from 'src/brand/brand.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [SerieController],
  providers: [SerieService],
  exports: [SerieService],
  imports: [TypeOrmModule.forFeature([Serie]), BrandModule, JwtModule],
})
export class SerieModule {}
