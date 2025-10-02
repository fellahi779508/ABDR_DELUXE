import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('promoPic')
export class PromoPic {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  publicId: string;
  @Column()
  url: string;
  @Column({ nullable: true })
  carSlug: string;
}
