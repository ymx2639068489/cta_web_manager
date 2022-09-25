import { PickType } from "@nestjs/swagger";
import { AllRecruitmentDto } from './allRecruitment.dto';
export class GetRecruitmentDto extends PickType(AllRecruitmentDto, [
  'id',
  'inchPhoto',
  'firstChoice',
  'secondChoice',
  'finallyDepartment',
  'isAdjust',
  'curriculumVitae',
  'reasonsForElection',
  'isDeliver',
  'status',
  'user',
]) {}