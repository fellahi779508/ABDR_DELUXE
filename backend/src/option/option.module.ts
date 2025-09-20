import { Module } from '@nestjs/common';
import { Option } from './option.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionController } from './option.controller';
import { OptionService } from './option.service';
import { CarModule } from 'src/car/car.module';

@Module({
  controllers: [OptionController],
  providers: [OptionService],
  exports: [OptionService],
  imports: [TypeOrmModule.forFeature([Option]), CarModule],
})
export class OptionModule {}
