import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** A single task change to record (status flip, title edit, creation, …). */
export interface ChangelogEntryInput {
  taskId: string;
  taskTitle: string;
  actorId: string;
  field: string;
  from?: string | null;
  to?: string | null;
}

@Injectable()
export class ChangelogService {
  constructor(private readonly prisma: PrismaService) {}

  /** Appends one entry to the audit trail. Called by TasksService. */
  record(entry: ChangelogEntryInput) {
    return this.prisma.changelog.create({ data: entry });
  }

  /** The acting user's recent task activity, newest first. */
  findForUser(actorId: string) {
    return this.prisma.changelog.findMany({
      where: { actorId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
