import { Car } from 'src/car/car.entity';
import { Cart } from 'src/cart/cart.entity';
import {
  AfterInsert,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SoldItem {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  quantity: number;
  @ManyToOne(() => Cart, (cart) => cart.soldItem, { onDelete: 'CASCADE' })
  cart: Cart;
  @OneToOne(() => Car, (car) => car.soldItem)
  @JoinColumn({ name: 'car_id' })
  car: Car;
  @Column()
  total: number;

  @AfterInsert()
  calculateTotal() {
    if (
      this.car &&
      typeof this.quantity === 'number' &&
      typeof this.car.price === 'number'
    ) {
      this.total = this.quantity * this.car.price;
    }
  }
}
