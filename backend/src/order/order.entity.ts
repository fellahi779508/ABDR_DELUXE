import { Cart } from 'src/cart/cart.entity';
import {
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
  @Column({ enum: ['pending', 'new', 'cancelled', 'accepted'], default: 'new' })
  status: string;
  @OneToOne(() => Cart, (cart) => cart.order, { cascade: true })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;
}
