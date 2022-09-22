import { ApiProperty, PickType } from '@nestjs/swagger';
import { AllRouterDto } from './AllRouter.dto';
export class CreateRouterDto extends PickType(AllRouterDto, [
  'name',
  'title',
]) {
  @ApiProperty({ isArray: true })
  children?: CreateRouterDto;
}
