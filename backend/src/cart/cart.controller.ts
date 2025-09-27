import { Body, Controller, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/createCart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post()
  async createNewCart(@Body() dto: CreateCartDto) {
    return await this.cartService.createNewCart(dto);
  }
}
