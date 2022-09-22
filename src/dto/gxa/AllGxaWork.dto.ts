import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { GxaDto } from "./allGxa.dto";

export class AllGxaWorkDto {
  @IsNumber()
  @ApiProperty({ description: 'id' })
  id: number;

  @IsNotEmpty()
  @ApiProperty({ description: '报名表' })
  gxaApplicationForm: GxaDto;

  @IsString()
  @ApiProperty({ description: '网站首页截图' })
  showImg: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '网站简介' })
  websiteIntroduction: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '网站地址' })
  websiteUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '网站代码github地址' })
  githubUrl: string;
}