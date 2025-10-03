import { Cart } from 'src/cart/cart.entity';
import { Status } from 'src/utils/enums';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  phone: string;
  @Column()
  address: string;
  @Column()
  email: string;
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
  @Column({
    enum: Status,
    default: Status.NEW,
  })
  status: string;
  @OneToOne(() => Cart, (cart) => cart.order, { cascade: true })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;
  @Column({ nullable: true })
  OrderCode: string;
  @Column({ nullable: true })
  passport: string;
}
