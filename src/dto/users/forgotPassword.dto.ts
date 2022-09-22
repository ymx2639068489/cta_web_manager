import { AllUserDto } from './all-user.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto extends PickType(AllUserDto, [
  'studentId',
  'qq',
  'password'
]) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '验证码', default: '123456' })
  code: string;
}
