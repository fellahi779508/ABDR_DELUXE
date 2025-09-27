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
import { SoldItem } from 'src/soldItem/soldItem.entity';

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
    this.slug = slugify(`${this.serie.name}-${this.finition}`);
  }
  @ManyToOne(() => Serie, (serie) => serie.cars, { onDelete: 'CASCADE' })
  serie: Serie;

  @Column({ nullable: true, type: 'boolean', default: true })
  isVisible: boolean;

  @OneToMany(() => Color, (color) => color.cars, {
    cascade: true,
    eager: false,
    nullable: true,
  })
  colors: Color[];

  @OneToMany(() => Option, (option) => option.car, {
    cascade: true,
    eager: false,
    nullable: true,
  })
  options?: Option[];

  @Column({ type: 'enum', enum: ['used', 'new'], default: 'new' })
  status: string;

  @Column({ nullable: true, type: 'boolean', default: false })
  isShiped: boolean;

  @Column({ nullable: true })
  oldPrice?: number;
  @OneToMany(() => SoldItem, (soldItem) => soldItem.car)
  soldItem: SoldItem;
}
