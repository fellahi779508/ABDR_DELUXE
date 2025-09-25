import { Brand } from 'src/brand/brand.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Icon {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  publicId: string;
  @Column()
  url: string;
  @OneToOne(() => Brand, (brand) => brand.icon, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;
}
