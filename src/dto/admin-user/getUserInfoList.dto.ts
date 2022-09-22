import { PickType } from "@nestjs/swagger";
import { UserDto } from "../users";

export class userInfoListDto extends PickType(UserDto, [
  'college',
  'major',
  'class',
  'studentId',
  'username',
  'qq'
]) {}
