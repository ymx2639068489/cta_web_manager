
import { ApiProperty, PickType } from "@nestjs/swagger";
import { AllUserDto } from "./all-user.dto";
import { CreateUserIdentityDto } from './user-identity.dto'
export class getUserInfoDto extends PickType(AllUserDto, [
  'studentId',
  'avatarUrl',
  'class',
  'college',
  'major',
  'gender',
  'phoneNumber',
  'qq',
  'username'
]) {
  @ApiProperty({ description: 'id', example: 20 })
  id: number;
  @ApiProperty({ description: '职位' })
  identity: CreateUserIdentityDto
}
