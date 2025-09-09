import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(new Error('No result returned from Cloudinary'));
          resolve(result as CloudinaryResponse);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
