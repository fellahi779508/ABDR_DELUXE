import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [
    TypeOrmModule.forFeature([Admin]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: config.get<string>('JWT_EXPIRATION') },
        };
      },
    }),
  ],
})
export class AdminModule {}
