import { Car } from 'src/car/car.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  price: number;
  @Column()
  address: string;
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
  @Column({ enum: ['pending', 'new', 'cancelled', 'accepted'], default: 'new' })
  status: string;
  @OneToMany(() => Car, (car) => car.order, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  cars: Car[];
}
