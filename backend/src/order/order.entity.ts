import { Car } from 'src/car/car.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
  @Column({ enum: ['pending', 'new', 'cancelled', 'accepted'], default: 'new' })
  status: string;
  @ManyToOne(() => Car, (car) => car.order, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  cars: Car;
}
