import { PickType } from "@nestjs/swagger";
import { AllJournalismDto } from "./all-journalism.dto";

export class CreateJournalismDto extends PickType(AllJournalismDto, [
  'content',
  'title'
]) {}

export class UpdateJournalismDto extends PickType(AllJournalismDto, [
  'id',
  'content',
  'title'
]) {}
