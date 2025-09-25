import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Icon } from './icon.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Brand } from 'src/brand/brand.entity';

@Injectable()
export class IconService {
  constructor(
    @InjectRepository(Icon) private readonly iconRepo: Repository<Icon>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async addIcons(brand: Brand, file: Express.Multer.File) {
    const upload = await this.cloudinaryService.uploadFile(
      file,
      `brands/${brand.id}`,
    );

    const icon = this.iconRepo.create({
      publicId: upload.public_id,
      url: upload.secure_url,
      brand,
    });

    return this.iconRepo.save(icon);
  }
  async deleteIcon(publicId: string) {
    return await this.cloudinaryService.deleteFile(publicId);
  }
}
