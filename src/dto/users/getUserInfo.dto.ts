
import { ApiProperty, PickType } from "@nestjs/swagger";
import { AllUserDto } from "./all-user.dto";
import { CreateUserIdentityDto } from './user-identity.dto'
export class GetUserInfoDto extends PickType(AllUserDto, [
  'id',
  'studentId',
  'gender',
  'college',
  'major',
  'class',
  'qq',
  'phoneNumber',
  'avatarUrl',
  'username'
]) {
  @ApiProperty({ description: '职位' })
  identity: CreateUserIdentityDto
}
