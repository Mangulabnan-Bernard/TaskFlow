import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  findAllForOwner(ownerId: string) {
    return this.prisma.teamMember.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'asc' },
    });
  }

  create(ownerId: string, dto: CreateMemberDto) {
    return this.prisma.teamMember.create({ data: { ...dto, ownerId } });
  }

  async remove(ownerId: string, id: string) {
    await this.ensureOwned(ownerId, id);
    await this.prisma.teamMember.delete({ where: { id } });
    return { id };
  }

  /** Throws unless the member exists and belongs to the user. */
  async ensureOwned(ownerId: string, id: string) {
    const member = await this.prisma.teamMember.findFirst({
      where: { id, ownerId },
    });
    if (!member) throw new NotFoundException('Team member not found');
    return member;
  }
}
