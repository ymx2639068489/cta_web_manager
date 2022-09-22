import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}

}
