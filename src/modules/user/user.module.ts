import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { AdminUser, Roles, User, UserIdentity } from '@/entities/admin';
@Module({
  imports: [
    TypeOrmModule.forFeature([Roles, AdminUser, User, UserIdentity])
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
