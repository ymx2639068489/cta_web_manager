import { PickType } from '@nestjs/swagger';
import { AllUserDto } from './all-user.dto';

export class CreateUserDto extends PickType(AllUserDto, [
  'username',
  'studentId',
  'password',
  'phoneNumber',
  'avatarUrl'
]) {}
