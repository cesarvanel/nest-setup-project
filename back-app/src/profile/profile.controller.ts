import { Body, Controller, Get, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '@nestjs/authentication';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  get(@CurrentUser('id') userId: string) {
    return this.profileService.find(userId);
  }

  @Put()
  update(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.profileService.update(userId, dto);
  }
}
