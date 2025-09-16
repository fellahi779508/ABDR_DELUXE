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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = process.env.NODE_ENV === 'production';

        return {
          type: config.get<string>('DB_TYPE') as any,
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_DATABASE'),

          // ✅ Auto-sync only in dev
          synchronize: !isProd,

          // ✅ Important for Supabase + Railway
          ssl: isProd ? { rejectUnauthorized: false } : false,

          entities: [Admin, Brand, Serie, Car, Order, Image],
        };
      },
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
