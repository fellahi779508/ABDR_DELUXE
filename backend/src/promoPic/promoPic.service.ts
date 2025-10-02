import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromoPic } from './promoPic.entity';
import { CreatePromoPicDto } from './dto/promoPic.dto';
import { ImageService } from 'src/image/image.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PromoPicService {
  constructor(
    @InjectRepository(PromoPic)
    private readonly promoPicRepo: Repository<PromoPic>,
    private readonly imageService: ImageService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async CreatePromotion(carSlug: string, file: Express.Multer.File) {
    const image = await this.imageService.addPromotionImg(file);
    const promoPic = this.promoPicRepo.create({
      publicId: image.publicId,
      url: image.url,
      carSlug,
    });
    return this.promoPicRepo.save(promoPic);
  }
  async GetAllPromoPics() {
    return this.promoPicRepo.find();
  }
  async DeletePromoPicById(id: number) {
    const pic = await this.promoPicRepo.findOne({ where: { id } });
    if (!pic) throw new NotFoundException('PromoPic not found');
    await this.cloudinaryService.deleteFile(pic.publicId);
    return this.promoPicRepo.remove(pic);
  }
  async DeleteAllPromoPics() {
    const images = await this.promoPicRepo.find();
    images.forEach((i) => this.cloudinaryService.deleteFile(i.publicId));
    return this.promoPicRepo.clear();
  }
}
