import { AnsEnum, TopicType } from "@/enum/TopicType";
import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { UserDto } from "../users";

export class AllQuestionDto {
  @ApiProperty({ description: 'id' })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ enum: TopicType, description: '题目类型' })
  @IsNotEmpty()
  type: TopicType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '题目' })
  topic: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '选项A' })
  optionA: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '选项B' })
  optionB: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '选项C' })
  optionC: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '选项D' })
  optionD: string;

  @IsNotEmpty()
  @ApiProperty({ enum: AnsEnum })
  ans: AnsEnum;
}

export class AllTestPaperDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '题目' })
  questions: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '分数' })
  score: number;

  @ApiProperty()
  @IsNotEmpty()
  user: UserDto;
}
