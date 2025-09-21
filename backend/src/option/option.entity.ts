import { Car } from 'src/car/car.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  value: string;
  @ManyToOne(() => Car, (car) => car.options, { onDelete: 'CASCADE' })
  car: Car;
}
