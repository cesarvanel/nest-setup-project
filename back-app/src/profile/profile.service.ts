import { Injectable } from '@nestjs/common';
import { ProfileEntity } from './profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  private readonly store: ProfileEntity[] = [
    { userId: 'admin', displayName: 'Administrateur', bio: 'Admin du système.', avatar: 1 },
  ];

  find(userId: string): ProfileEntity {
    let profile = this.store.find((p) => p.userId === userId);
    if (!profile) {
      profile = {
        userId,
        displayName: userId,
        bio: '',
        avatar: Math.ceil(Math.random() * 70),
      };
      this.store.push(profile);
    }
    return profile;
  }

  update(userId: string, dto: UpdateProfileDto): ProfileEntity {
    const index = this.store.findIndex((p) => p.userId === userId);
    if (index === -1) {
      const profile = { userId, ...dto };
      this.store.push(profile);
      return profile;
    }
    this.store[index] = { ...this.store[index], ...dto };
    return this.store[index];
  }
}
