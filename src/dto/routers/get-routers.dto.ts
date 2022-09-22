import { ApiProperty, PickType } from '@nestjs/swagger';
import { AllRouterDto } from './AllRouter.dto';
export class GetRouterDto extends PickType(AllRouterDto, [
  'name',
  'title',
]) {
  @ApiProperty({ isArray: true, description: '子路由' })
  children: GetRouterDto;
}
