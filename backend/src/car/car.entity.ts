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
  @Column()
  color: string;
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
  @OneToOne(() => Order, (order) => order.cars, { nullable: true })
  @JoinColumn({ name: 'orderId' })
  order: Order;
  @OneToMany(() => Image, (image) => image.car, {
    cascade: true,
    eager: false,
  })
  images: Image[];
  @Column({ nullable: true })
  isVisible: boolean;
}
