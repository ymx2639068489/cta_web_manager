import { PickType } from "@nestjs/swagger";
import { AllUserDto } from "./all-user.dto";

export class UserDto extends PickType(AllUserDto, [
  'username',
  'studentId',
  'gender',
  'college',
  'major',
  'class',
  'qq',
  'phoneNumber',
  'avatarUrl'
]) {}
