import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Admin } from './admin.entity';
import { JWTPayloadType } from 'src/utils/JWTPayloadType';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Auth } from './dto/auth';
import { Response } from 'express';
export class AdminService {
  private auth = new Auth();
  constructor(
    @InjectRepository(Admin) private AdminRepo: Repository<Admin>,
    private jwt: JwtService,
  ) {}
  async CreateAdmin(dto: CreateAdminDto) {
    const { username, password } = dto;
    const hashedPassword = await this.auth.HashPassword(password);
    const adminExists = await this.AdminRepo.findOne({ where: { username } });
    if (adminExists) {
      throw new BadRequestException('Admin already exists');
    }
    const admin = this.AdminRepo.create({ username, password: hashedPassword });
    return await this.AdminRepo.save(admin);
  }
  async Login(dto: CreateAdminDto, res: Response) {
    const { username, password } = dto;
    const admin = await this.AdminRepo.findOne({ where: { username } });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const isMatched = await this.auth.ComparePassword(password, admin.password);
    if (!isMatched) {
      throw new BadRequestException('Password is incorrect');
    }

    const payload: JWTPayloadType = {
      id: admin.id,
      username: admin.username,
    };

    const token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION,
    });

    return token;
  }
  async DeleteAdmin(id: number) {
    const admin = await this.AdminRepo.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return await this.AdminRepo.remove(admin);
  }
}
