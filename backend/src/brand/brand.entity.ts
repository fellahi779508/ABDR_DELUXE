import { Serie } from 'src/serie/serie.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'brand' })
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  //   @Column()
  //   logo: string;

  @OneToMany(() => Serie, (serie) => serie.brand, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  series: Serie[];
}
