import { Car } from 'src/car/car.entity';
import { Order } from 'src/order/order.entity';
import { SoldItem } from 'src/soldItem/soldItem.entity';
import {
  AfterInsert,
  BeforeInsert,
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
  @OneToMany(() => SoldItem, (soldItem) => soldItem.cart, {
    cascade: true,
    nullable: true,
  })
  soldItem: SoldItem[];
  @Column({ nullable: true })
  total: number;
  @OneToOne(() => Order, (order) => order.cart, { onDelete: 'CASCADE' })
  order: Order;
  @BeforeInsert() async calculateTotal() {
    this.total = this.soldItem.reduce((acc, item) => acc + item.total, 0);
  }
}
