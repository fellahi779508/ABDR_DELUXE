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
  @ManyToOne(() => Brand, (brand) => brand.series, {
    onDelete: 'CASCADE',
  })
  brand: Brand;
  @OneToMany(() => Car, (car) => car.serie, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  cars: Car[];
}
