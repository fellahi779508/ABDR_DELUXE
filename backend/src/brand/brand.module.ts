import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './brand.entity';
import { JwtModule } from '@nestjs/jwt';
import { IconModule } from 'src/icon/icon.module';

@Module({
  imports: [TypeOrmModule.forFeature([Brand]), JwtModule, IconModule],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService],
})
export class BrandModule {}
