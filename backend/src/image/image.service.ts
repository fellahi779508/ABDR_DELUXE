import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { Car } from 'src/car/car.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CarService } from 'src/car/car.service';
import { Color } from 'src/color/color.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image) private imageRepo: Repository<Image>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async addImages(
    color: Color,
    files: Express.Multer.File[],
    isPrimary: boolean,
  ) {
    const uploads = await Promise.all(
      files.map((file) =>
        this.cloudinaryService.uploadFile(file, `cars/${color.id}`),
      ),
    );

    const hasAny = await this.imageRepo.exist({
      where: { color: { id: color.id } },
    });

    const images = uploads.map((u, idx) =>
      this.imageRepo.create({
        color,
        publicId: u.public_id,
        url: u.secure_url,
        width: u.width,
        height: u.height,
        format: u.format,
        bytes: u.bytes,
        isPrimary: isPrimary,
        sortOrder: (hasAny ? 1 : 0) + idx,
      }),
    );

    return this.imageRepo.save(images);
  }

  async removeImage(id: string) {
    const image = await this.imageRepo.findOne({ where: { id } });
    if (!image) throw new NotFoundException('Image not found');
    await this.cloudinaryService.deleteFile(image.publicId);
    await this.imageRepo.remove(image);
    return { success: true };
  }

  async getCarImages(colorId: number) {
    return this.imageRepo.find({
      where: { color: { id: colorId } },
      order: { sortOrder: 'asc' },
    });
  }

  async updateImageToPrimary(imageId: string) {
    const image = await this.imageRepo.findOne({ where: { id: imageId } });
    if (!image) throw new NotFoundException('Image not found');
    image.isPrimary = true;
    const rest = await this.imageRepo.find({
      where: { color: { images: { id: imageId } } },
    });
    if (!rest) return this.imageRepo.save(image);
    rest.forEach((i) => (i.isPrimary = false));
    await this.imageRepo.save(rest);
    return this.imageRepo.save(image);
  }

  async DeleteAllCarImages(colorId: number) {
    const images = await this.imageRepo.find({
      where: { color: { id: colorId } },
    });
    images.forEach((i) => this.cloudinaryService.deleteFile(i.publicId));
    await this.imageRepo.remove(images);
    return { success: true };
  }
}
