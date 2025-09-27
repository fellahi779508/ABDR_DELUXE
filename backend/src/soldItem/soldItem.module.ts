import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoldItem } from './soldItem.entity';
import { SoldItemController } from './soldItem.controller';
import { SoldItemService } from './soldItem.service';
import { CarModule } from 'src/car/car.module';

@Module({
  imports: [TypeOrmModule.forFeature([SoldItem]), CarModule],
  controllers: [SoldItemController],
  providers: [SoldItemService],
  exports: [SoldItemService],
})
export class SoldItemModule {}
