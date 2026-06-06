import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

// Intentionally unguarded — it's used to bootstrap a fresh database before any
// user/token exists. The service itself blocks the call in production.
@Controller('seed')
export class SeedController {
  constructor(private readonly seed: SeedService) {}

  @Post()
  run() {
    return this.seed.run();
  }
}
