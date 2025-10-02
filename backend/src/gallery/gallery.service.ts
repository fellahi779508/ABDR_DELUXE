import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gallery } from './gallery.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepo: Repository<Gallery>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async UploadImage(file: Express.Multer.File[]) {
    for (const f of file) {
      const upload = await this.cloudinaryService.uploadFile(f, `gallery`);
      const gallery = this.galleryRepo.create({
        publicId: upload.public_id,
        url: upload.secure_url,
      });
      await this.galleryRepo.save(gallery);
    }
  }
  async DeleteImage(id: number) {
    const image = await this.galleryRepo.findOne({ where: { id } });
    if (!image) throw new NotFoundException('Image not found');
    await this.cloudinaryService.deleteFile(image.publicId);
    await this.galleryRepo.remove(image);
    return { success: true };
  }
  async GetAllImages() {
    return await this.galleryRepo.find({ order: { id: 'ASC' } });
  }
  async DeleteAllImages() {
    const images = await this.galleryRepo.find();
    images.forEach((i) => this.cloudinaryService.deleteFile(i.publicId));
    await this.galleryRepo.remove(images);
    return { success: true };
  }
}
