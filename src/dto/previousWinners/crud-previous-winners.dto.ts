import { AllPreviousWinnersDto } from "./all-previous-winners.dto";
import { PickType, PartialType, IntersectionType } from "@nestjs/swagger";

export class CreatePreviousWinnerDto extends IntersectionType(
  class extends PickType(AllPreviousWinnersDto, [
    'awardLevel',
    'studentId',
    'competitionName',
    'session',
  ]) {},
  class extends PartialType(
    class extends PickType(AllPreviousWinnersDto, [
      'remarks'
    ]) {}
  ) {}
) {}

export class UpdatePreviousWinnersDto extends IntersectionType(
  class extends PickType(AllPreviousWinnersDto, [
    'id'
  ]) {},
  class extends PartialType(
    class extends PickType(AllPreviousWinnersDto, [
      'awardLevel',
      'remarks'
    ]) {}
  ) {}
) {}
