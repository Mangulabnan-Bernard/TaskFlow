import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, type AuthUser } from '../common/current-user.decorator';
import { ChangelogService } from './changelog.service';

@UseGuards(JwtAuthGuard)
@Controller('changelogs')
export class ChangelogController {
  constructor(private readonly changelog: ChangelogService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.changelog.findForUser(user.id);
  }
}
