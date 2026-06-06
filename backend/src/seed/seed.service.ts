import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const DEMO_EMAIL = 'demo@taskflow.dev';
const DEMO_PASSWORD = 'password123';

interface SeedTask {
  title: string;
  status: TaskStatus;
}

// Mirrors the frontend mock data (frontend/lib/data.ts) so the seeded board
// matches the UI that was built against it.
const SEED_PROJECTS: {
  name: string;
  description: string;
  tasks: SeedTask[];
}[] = [
  {
    name: 'Quantum API Integration',
    description:
      'Standardizing backend communication protocols for the next-gen satellite mesh.',
    tasks: [
      { title: 'Design auth token refresh flow', status: TaskStatus.TODO },
      {
        title: 'Write API contract for satellite mesh',
        status: TaskStatus.TODO,
      },
      {
        title: 'Implement WebSocket handshake protocol',
        status: TaskStatus.IN_PROGRESS,
      },
      { title: 'Fix API timeout bug', status: TaskStatus.DONE },
    ],
  },
  {
    name: 'Aurora UI Rebranding',
    description:
      'Migrating legacy CSS components to the new atomic design system for the enterprise suite.',
    tasks: [
      {
        title: 'Audit color-contrast tokens for accessibility',
        status: TaskStatus.TODO,
      },
      {
        title: 'Migrate legacy button components to atomic system',
        status: TaskStatus.IN_PROGRESS,
      },
      { title: 'Set up design-token build pipeline', status: TaskStatus.DONE },
    ],
  },
];

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resets and repopulates the demo user's data. Idempotent — safe to call
   * repeatedly. Disabled in production unless ALLOW_SEED=true.
   */
  async run() {
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.ALLOW_SEED !== 'true'
    ) {
      throw new ForbiddenException('Seeding is disabled in production');
    }

    const password = await bcrypt.hash(DEMO_PASSWORD, 10);
    const user = await this.prisma.user.upsert({
      where: { email: DEMO_EMAIL },
      update: { password },
      create: { email: DEMO_EMAIL, name: 'Demo User', password },
    });

    // Wipe prior demo data so re-seeding stays idempotent. Changelogs first
    // (deleting projects cascades to tasks, which would only null their
    // taskId), then the projects themselves.
    await this.prisma.changelog.deleteMany({ where: { actorId: user.id } });
    await this.prisma.project.deleteMany({ where: { ownerId: user.id } });

    let taskCount = 0;
    for (const p of SEED_PROJECTS) {
      const project = await this.prisma.project.create({
        data: { name: p.name, description: p.description, ownerId: user.id },
      });

      for (const t of p.tasks) {
        const task = await this.prisma.task.create({
          data: { projectId: project.id, title: t.title, status: t.status },
        });
        taskCount++;

        // Give each task a plausible history: a creation entry, plus a status
        // entry for anything that has moved past Todo.
        await this.prisma.changelog.create({
          data: {
            taskId: task.id,
            taskTitle: task.title,
            actorId: user.id,
            field: 'created',
          },
        });
        if (t.status !== TaskStatus.TODO) {
          await this.prisma.changelog.create({
            data: {
              taskId: task.id,
              taskTitle: task.title,
              actorId: user.id,
              field: 'status',
              from: TaskStatus.TODO,
              to: t.status,
            },
          });
        }
      }
    }

    this.logger.log(
      `Seeded ${SEED_PROJECTS.length} projects / ${taskCount} tasks for ${DEMO_EMAIL}`,
    );

    return {
      message: 'Database seeded',
      credentials: { email: DEMO_EMAIL, password: DEMO_PASSWORD },
      projects: SEED_PROJECTS.length,
      tasks: taskCount,
    };
  }
}
