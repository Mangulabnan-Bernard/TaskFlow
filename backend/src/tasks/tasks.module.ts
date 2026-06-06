import { Module } from '@nestjs/common';
import { ChangelogModule } from '../changelog/changelog.module';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [ChangelogModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
