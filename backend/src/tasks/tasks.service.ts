import { Injectable, NotFoundException } from '@nestjs/common';
import type { TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateTaskDto) {
    await this.ensureProjectOwned(ownerId, dto.projectId);
    return this.prisma.task.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        description: dto.description,
        status: dto.status,
      },
    });
  }

  async findByProject(ownerId: string, projectId: string) {
    await this.ensureProjectOwned(ownerId, projectId);
    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(ownerId: string, id: string, dto: UpdateTaskDto) {
    await this.ensureTaskOwned(ownerId, id);
    return this.prisma.task.update({ where: { id }, data: dto });
  }

  async updateStatus(ownerId: string, id: string, status: TaskStatus) {
    await this.ensureTaskOwned(ownerId, id);
    return this.prisma.task.update({ where: { id }, data: { status } });
  }

  async remove(ownerId: string, id: string) {
    await this.ensureTaskOwned(ownerId, id);
    await this.prisma.task.delete({ where: { id } });
    return { id };
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
