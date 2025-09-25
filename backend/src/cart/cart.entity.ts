import { Car } from 'src/car/car.entity';
import { Order } from 'src/order/order.entity';
import { SoldItem } from 'src/soldItem/soldItem.entity';
import {
  AfterInsert,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToMany(() => SoldItem, (soldItem) => soldItem.cart)
  soldItem: SoldItem[];
  @Column()
  total: number;
  @OneToOne(() => Order, (order) => order.cart)
  order: Order;
  @AfterInsert() async calculateTotal() {
    this.total = this.soldItem.reduce((acc, item) => acc + item.total, 0);
  }
}
