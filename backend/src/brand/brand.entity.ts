import { Icon } from 'src/icon/icon.entity';
import { Serie } from 'src/serie/serie.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'brand' })
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @OneToMany(() => Serie, (serie) => serie.brand, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  series: Serie[];
  @OneToOne(() => Icon, (icon) => icon.brand, { cascade: true, nullable: true })
  @JoinColumn({ name: 'icon_id' })
  icon: Icon;
}
