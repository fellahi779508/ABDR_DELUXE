// data-source.ts
import { Brand } from 'src/brand/brand.entity';
import { Car } from 'src/car/car.entity';
import { Order } from 'src/order/order.entity';
import { Serie } from 'src/serie/serie.entity';
import { Admin, DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || undefined,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Admin, Brand, Serie, Car, Order, Image],
  migrations: ['dist/migrations/*.js'],
});
