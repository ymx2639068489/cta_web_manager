import { ApiProperty, PartialType, IntersectionType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AllBannerDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '图片链接' })
  href: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '图片地址' })
  url: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '名字' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '顺序' })
  rank: number;
}
export class CreateBannerDto extends IntersectionType(
  class extends PartialType(class extends PickType(AllBannerDto, [
    'href',
    'name',
  ]) {}) {},
  class extends PickType(AllBannerDto, [
    'url',
    'rank'
  ]) {}
) {}

export class UpdateBannerDto extends IntersectionType(
  class extends PickType(AllBannerDto, [
    'id'
  ]) {},
  class extends PartialType(
    class extends PickType(AllBannerDto, [
      'href',
      'name',
      'rank',
      'url',
    ]) {}
  ) {}
) {}