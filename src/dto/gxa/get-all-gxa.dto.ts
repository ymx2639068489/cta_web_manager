import { ApiProperty, PickType } from "@nestjs/swagger";
import { AllGxaWorkDto } from "./AllGxaWork.dto";

class temp1 extends PickType(AllGxaWorkDto, [
  'id',
  'githubUrl',
  'showImg',
  'websiteIntroduction',
  'websiteUrl'
]) {
  @ApiProperty({ description: '作品名称' })
  workName: string;
  @ApiProperty()
  score: number[];
}

export class GetAllGxaDto {
  @ApiProperty({ description: '静态作品列表', isArray: true })
  static: temp1;

  @ApiProperty({ description: '动态作品列表', isArray: true })
  dynamic: temp1;
}