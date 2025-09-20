import { Car } from 'src/car/car.entity';
import { Image } from 'src/image/image.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Color {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Car, (car) => car.colors)
  cars: Car;

  @OneToMany(() => Image, (image) => image.color, {
    nullable: true,
    cascade: true,
  })
  images?: Image[];
}
