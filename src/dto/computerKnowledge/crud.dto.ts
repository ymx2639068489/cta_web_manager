import { PartialType, PickType, IntersectionType } from "@nestjs/swagger";
import { AllQuestionDto } from "./all.dto";

export class CreateQuestionDto extends IntersectionType(
  class extends PickType(AllQuestionDto, [
    'topic',
    'optionA',
    'optionB',
    'ans',
    'type'
  ]) {},
  class extends PartialType(
    class extends PickType(AllQuestionDto, [
      'optionC',
      'optionD'
    ]) {}
  ) {}
) {}

export class UpdateQuestionDto extends IntersectionType(
  class extends PickType(AllQuestionDto, [
    'id'
  ]) {},
  class extends PartialType(
    class extends PickType(AllQuestionDto, [
      'topic',
      'optionA',
      'optionB',
      'optionC',
      'ans',
      'optionD',
      'type'
    ]) {}
  ) {}
) {}

