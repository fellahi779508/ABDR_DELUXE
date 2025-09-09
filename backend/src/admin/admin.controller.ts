// admin.controller.ts
import { Body, Controller, Delete, Post, Res } from '@nestjs/common';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { AdminService } from './admin.service';
import express from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.adminService.CreateAdmin(dto);
  }

  @Post('login')
  async login(
    @Body() dto: CreateAdminDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    return this.adminService.Login(dto, res);
  }

  @Delete(':id')
  deleteAdmin(@Body('id') id: number) {
    return this.adminService.DeleteAdmin(id);
  }
  @Post('logout')
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }
}
