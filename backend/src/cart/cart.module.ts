import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';

@Module({
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
  imports: [TypeOrmModule.forFeature([Cart])],
})
export class CartModule {}
