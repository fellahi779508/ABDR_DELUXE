import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { JwtModule } from '@nestjs/jwt';
import { CartModule } from 'src/cart/cart.module';
import { OrderGateway } from 'src/websockets/order.gateway';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderGateway],
  exports: [OrderService, OrderGateway],
  imports: [TypeOrmModule.forFeature([Order]), JwtModule, CartModule],
})
export class OrderModule {}
