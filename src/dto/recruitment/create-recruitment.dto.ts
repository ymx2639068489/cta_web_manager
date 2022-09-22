
import { PickType, PartialType } from "@nestjs/swagger";
import { AllRecruitmentDto } from './allRecruitment.dto';

class temp extends PickType(AllRecruitmentDto, [
  'inchPhoto',
  'firstChoice',
  'secondChoice',
  'isAdjust',
  'curriculumVitae',
  'reasonsForElection'
]) {}

export class UpdateRecruitmentDto extends PartialType(temp) {}