import { ApiProperty } from "@nestjs/swagger";
import { IsBIC, IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { GetInfo } from "../admin-user";


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