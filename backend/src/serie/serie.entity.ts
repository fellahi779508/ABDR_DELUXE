import { Brand } from 'src/brand/brand.entity';
import { Car } from 'src/car/car.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'serie' })
export class Serie {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToOne(() => Brand, (brand) => brand.series)
  brand: Brand;
  @OneToMany(() => Car, (car) => car.serie, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  cars: Car[];
}
