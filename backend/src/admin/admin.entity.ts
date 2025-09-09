import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'admin' })
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: number;
  @Column()
  username: string;
  @Column()
  password: string;
}
