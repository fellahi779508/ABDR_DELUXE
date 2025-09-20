import { Order } from 'src/order/order.entity';
import { Serie } from 'src/serie/serie.entity';
import slugify from 'slugify';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from 'src/image/image.entity';
import { Color } from 'src/color/color.entity';
import { Option } from 'src/option/option.entity';

@Entity({ name: 'car' })
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  finition?: string;

  @Column()
  price: number;

  @Column()
  Moteur: string;

  @Column()
  Energie: string;

  @Column()
  Boite: string;

  @Column()
  Kilométrage: string;

  @Column()
  Année: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  slug: string;

  @BeforeInsert()
  generateSlug() {
    this.slug = slugify(
      `${this.serie.name}-${this.finition}-${this.Année}`,
    ).toLowerCase();
  }
  @ManyToOne(() => Serie, (serie) => serie.cars, { onDelete: 'CASCADE' })
  serie: Serie;

  @OneToMany(() => Order, (order) => order.cars, {
    nullable: true,
    cascade: true,
  })
  order: Order;

  @Column({ nullable: true })
  isVisible: boolean;

  @OneToMany(() => Color, (color) => color.cars)
  colors: Color[];

  @OneToMany(() => Option, (option) => option.car, {
    cascade: true,
    eager: false,
    nullable: true,
  })
  options?: Option[];

  @Column({ type: 'enum', enum: ['used', 'new'], default: 'new' })
  status: string;

  @OneToMany(() => Image, (image) => image.car, {
    nullable: true,
    cascade: true,
  })
  images?: Image[];
}
