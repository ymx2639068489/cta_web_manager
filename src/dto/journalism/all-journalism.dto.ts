import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsBIC, IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { AllAdminUserDto, GetInfo } from "../admin-user";


export class AllJournalismDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'id' })
  id: number;

  @IsNotEmpty()
  @ApiProperty({ description: '作者' })
  author: GetInfo;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '标题' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '内容' })
  content: string;
  
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: '是否审核通过' })
  isApprove: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '是否审核通过' })
  reasonsForRefusal: string;
}
class AuthorDto extends PickType(AllAdminUserDto, [
  'id',
  'username',
  'nickName',
  'avatarUrl',
  'email',
  'phone',
]) {}
export class GetJournalismDto extends PickType(AllJournalismDto, [
  'id',
  'title',
  'content',
  'isApprove',
  'reasonsForRefusal'
]) {
  @ApiProperty({ description: '作者' })
  author: AuthorDto;
}