import { Car } from 'src/car/car.entity';
import { Color } from 'src/color/color.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('image')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  publicId: string;

  @Column()
  url: string;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  format: string;

  @Column()
  bytes: number;

  @Column({ default: false })
  isPrimary: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToOne(() => Car, (car) => car.images, {
    onDelete: 'CASCADE',
  })
  car: Car;
  @ManyToOne(() => Color, (color) => color.images, {
    onDelete: 'CASCADE',
  })
  color: Color;
}
