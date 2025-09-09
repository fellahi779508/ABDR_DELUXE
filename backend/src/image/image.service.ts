import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { Car } from 'src/car/car.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CarService } from 'src/car/car.service';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image) private imageRepo: Repository<Image>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async addImages(car: Car, files: Express.Multer.File[], isPrimary: boolean) {
    const uploads = await Promise.all(
      files.map((file) =>
        this.cloudinaryService.uploadFile(file, `cars/${car.id}`),
      ),
    );

    const hasAny = await this.imageRepo.exist({
      where: { car: { id: car.id } },
    });

    const images = uploads.map((u, idx) =>
      this.imageRepo.create({
        car,
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

  async removeImage(imageId: string) {
    const image = await this.imageRepo.findOne({ where: { id: imageId } });
    if (!image) throw new NotFoundException('Image not found');

    await this.cloudinaryService.deleteFile(image.publicId);
    await this.imageRepo.remove(image);
    return { success: true };
  }

  async getCarImages(carId: string) {
    return this.imageRepo.find({
      where: { car: { id: carId } },
      order: { sortOrder: 'asc' },
    });
  }
  async updateImageToPrimary(imageId: string) {
    const image = await this.imageRepo.findOne({ where: { id: imageId } });
    if (!image) throw new NotFoundException('Image not found');
    image.isPrimary = true;
    const rest = await this.imageRepo.find({
      where: { car: { images: { id: imageId } } },
    });
    rest.forEach((i) => ((i.isPrimary = false), this.imageRepo.save(i)));
    return this.imageRepo.save(image);
  }
  async DeleteAllCarImages(imageId: string) {
    const images = await this.imageRepo.find({
      where: { car: { id: imageId } },
    });
    await this.imageRepo.remove(images);
    return { success: true };
  }
}
