import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { AllUserDto, CreateUserIdentityDto } from "../users";
class identityDto extends CreateUserIdentityDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'id' })
  id: number;
}
export class userInfoListDto extends PickType(AllUserDto, [
  'id',
  'username',
  'studentId',
  'gender',
  'college',
  'major',
  'class',
  'avatarUrl'
]) {
  @IsNotEmpty()
  @ApiProperty({ description: '' })
  identity: identityDto;
}
export class GetFormerCadres extends PickType(userInfoListDto,[
  'id',
  'college',
  'major',
  'class',
  'username',
  'studentId'
]) {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '第几届' })
  session: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '', default: '理事会_会长' })
  identity: string;

}