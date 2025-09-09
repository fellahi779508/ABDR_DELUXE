import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin/admin.entity';
import { AdminModule } from './admin/admin.module';
import { BrandModule } from './brand/brand.module';
import { Brand } from './brand/brand.entity';

import { CarModule } from './car/car.module';
import { Car } from './car/car.entity';
import { Serie } from './serie/serie.entity';
import { SerieModule } from './serie/serie.module';
import { Order } from './order/order.entity';
import { OrderModule } from './order/order.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ImageModule } from './image/image.module';
import { Image } from './image/image.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: config.get<string>('DB_TYPE') as any,
          database: config.get<string>('DB_DATABASE'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          port: config.get<number>('DB_PORT'),
          host: config.get<string>('DB_HOST'),
          synchronize: true,

          entities: [Admin, Brand, Serie, Car, Order, Image],
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AdminModule,
    BrandModule,
    SerieModule,
    CarModule,
    OrderModule,
    CloudinaryModule,
    ImageModule,
  ],
})
export class AppModule {}
