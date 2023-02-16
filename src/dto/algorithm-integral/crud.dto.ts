import { ApiProperty, IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AlgorithmIntegralDto } from './all.dto';

export class CreateIntegral extends PickType(AlgorithmIntegralDto, [
  'compititionName',
  'integral',
  'semester',
  'description',
  'group',
]) {
  @ApiProperty({ description: '姓名' })
  @IsString()
  @IsNotEmpty()
  studentId: string;
}
export class CreateIntegrals {
  @ApiProperty({ description: '一组单数据' })
  @IsArray()
  @IsNotEmpty()
  data: CreateIntegral[];
}
export class UpdateIntegral extends PickType(CreateIntegral, [
  'integral',
  'description',
]) {
  @ApiProperty({ description: 'id' })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
