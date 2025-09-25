import { Module } from '@nestjs/common';
import { IconService } from './icon.service';
import { IconController } from './icon.controller';
import { Icon } from './icon.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [IconController],
  providers: [IconService],
  exports: [IconService],
  imports: [TypeOrmModule.forFeature([Icon]), CloudinaryModule],
})
export class IconModule {}
