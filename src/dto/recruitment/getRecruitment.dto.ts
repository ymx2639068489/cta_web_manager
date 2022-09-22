import { PickType } from "@nestjs/swagger";
import { AllRecruitmentDto } from './allRecruitment.dto';
export class GetRecruitmentDto extends PickType(AllRecruitmentDto, [
  'user',
  'isAdjust',
  'inchPhoto',
  'firstChoice',
  'secondChoice',
  'curriculumVitae',
  'reasonsForElection',
]) {}