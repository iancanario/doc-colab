import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @ApiOperation({
    summary: 'Health Check',
  })
  @ApiOkResponse({
    description: 'Application healthy',
    example: {
      status: 'ok',
      info: {
        database: {
          status: 'up',
        },
        memory_heap: {
          status: 'up',
        },
      },
      error: {},
      details: {
        database: {
          status: 'up',
        },
        memory_heap: {
          status: 'up',
        },
      },
    },
  })
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
    ]);
  }

  @ApiOperation({
    summary: 'Server Live Check',
  })
  @ApiOkResponse({
    description: 'Application healthy',
    example: {
      status: 'ok',
      timestamp: '2026-08-02T00:10:15.299Z',
    },
  })
  @Get('live')
  live() {
    return {
      status: 'ok',
      timestamp: new Date(),
    };
  }

  @ApiOperation({
    summary: 'Database Health Check',
  })
  @ApiOkResponse({
    description: 'Application healthy',
    example: {
      status: 'ok',
      info: {
        database: {
          status: 'up',
        },
      },
      error: {},
      details: {
        database: {
          status: 'up',
        },
      },
    },
  })
  @Get('database')
  @HealthCheck()
  database() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
