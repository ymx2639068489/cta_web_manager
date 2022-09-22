// import { User } from "@/entities/users";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { UserDto } from "../users";
export class GxaDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '第几届', default: new Date().getFullYear() })
  session: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '作品名称', default: '国信安作品名' })
  workName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '队伍名称', default: '国信安一队' })
  teamName: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: '参赛组别 false->静态, true->动态', default: false })
  group: boolean;

  @IsNotEmpty()
  @ApiProperty({ description: '队长' })
  leader: UserDto;

  @ApiProperty({ description: '队员1' })
  teamMember1: UserDto;

  @ApiProperty({ description: '队员2' })
  teamMember2: UserDto;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '队伍成员特长' })
  teamMemberSpecialty: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '作品简介' })
  introductionToWorks: string;

  @IsBoolean()
  @ApiProperty({ description: '是否提交' })
  isDeliver: boolean;
}