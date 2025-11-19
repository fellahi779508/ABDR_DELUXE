import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoldItem } from './soldItem.entity';
import { SoldItemController } from './soldItem.controller';
import { SoldItemService } from './soldItem.service';
import { CarModule } from 'src/car/car.module';
import { JwtModule } from '@nestjs/jwt';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SoldItem]),
    CarModule,
    JwtModule,
    forwardRef(() => CartModule),
  ],
  controllers: [SoldItemController],
  providers: [SoldItemService],
  exports: [SoldItemService],
})
export class SoldItemModule {}
