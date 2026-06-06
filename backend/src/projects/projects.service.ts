import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  create(ownerId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({ data: { ...dto, ownerId } });
  }

  findAll(ownerId: string) {
    return this.prisma.project.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { tasks: true } } },
    });
  }

  async findOne(ownerId: string, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, ownerId },
      include: { tasks: { orderBy: { createdAt: 'asc' } } },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(ownerId: string, id: string, dto: UpdateProjectDto) {
    await this.ensureOwned(ownerId, id);
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  async remove(ownerId: string, id: string) {
    await this.ensureOwned(ownerId, id);
    await this.prisma.project.delete({ where: { id } });
    return { id };
  }

  /** Throws unless the project exists and belongs to the user. */
  private async ensureOwned(ownerId: string, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, ownerId },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }
}
