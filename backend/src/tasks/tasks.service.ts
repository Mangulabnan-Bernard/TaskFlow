import { Injectable, NotFoundException } from '@nestjs/common';
import type { Task, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ChangelogService } from '../changelog/changelog.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly changelog: ChangelogService,
  ) {}

  async create(ownerId: string, dto: CreateTaskDto) {
    await this.ensureProjectOwned(ownerId, dto.projectId);
    const task = await this.prisma.task.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        description: dto.description,
        status: dto.status,
      },
    });
    await this.changelog.record({
      taskId: task.id,
      taskTitle: task.title,
      actorId: ownerId,
      field: 'created',
    });
    return task;
  }

  async findByProject(ownerId: string, projectId: string) {
    await this.ensureProjectOwned(ownerId, projectId);
    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /** Every task across the user's projects, each with its project name. */
  findAllForOwner(ownerId: string) {
    return this.prisma.task.findMany({
      where: { project: { ownerId } },
      orderBy: { createdAt: 'asc' },
      include: { project: { select: { id: true, name: true } } },
    });
  }

  async update(ownerId: string, id: string, dto: UpdateTaskDto) {
    const before = await this.ensureTaskOwned(ownerId, id);
    const after = await this.prisma.task.update({ where: { id }, data: dto });
    await this.logChanges(ownerId, before, after);
    return after;
  }

  async updateStatus(ownerId: string, id: string, status: TaskStatus) {
    const before = await this.ensureTaskOwned(ownerId, id);
    if (before.status === status) return before;
    const after = await this.prisma.task.update({
      where: { id },
      data: { status },
    });
    await this.logChanges(ownerId, before, after);
    return after;
  }

  async remove(ownerId: string, id: string) {
    await this.ensureTaskOwned(ownerId, id);
    await this.prisma.task.delete({ where: { id } });
    return { id };
  }

  /** Records a changelog entry for each field that actually changed. */
  private async logChanges(actorId: string, before: Task, after: Task) {
    if (before.status !== after.status) {
      await this.changelog.record({
        taskId: after.id,
        taskTitle: after.title,
        actorId,
        field: 'status',
        from: before.status,
        to: after.status,
      });
    }
    if (before.title !== after.title) {
      await this.changelog.record({
        taskId: after.id,
        taskTitle: after.title,
        actorId,
        field: 'title',
        from: before.title,
        to: after.title,
      });
    }
  }

  private async ensureProjectOwned(ownerId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  /** A task is "owned" when its project belongs to the user. */
  private async ensureTaskOwned(ownerId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, project: { ownerId } },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }
}
