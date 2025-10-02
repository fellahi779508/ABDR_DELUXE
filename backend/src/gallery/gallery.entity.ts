import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('gallery')
export class Gallery {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  url: string;
  @Column()
  publicId: string;
}
