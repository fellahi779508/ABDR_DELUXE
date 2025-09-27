import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { SoldItemService } from 'src/soldItem/soldItem.service';
import { SoldItemModule } from 'src/soldItem/soldItem.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
  imports: [TypeOrmModule.forFeature([Cart]), SoldItemModule],
})
export class CartModule {}
