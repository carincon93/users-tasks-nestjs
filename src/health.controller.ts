
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

import { Public } from './auth/decorators/public-auth.decorator';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private config: ConfigService,
        private http: HttpHealthIndicator,
        private db: TypeOrmHealthIndicator,
    ) { }

    @Public()
    @Get()
    @HealthCheck()
    check() {
        console.log(this.config.get('api.host'));
        console.log(this.config.get('api.port'));
        return this.health.check([
            () => this.http.pingCheck('api', `${this.config.get('api.host')}:${this.config.get('api.port')}/docs`, { timeout: 1000 }),
            () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com', { timeout: 1000 }),
            () => this.db.pingCheck('database', { timeout: 1000 }),
        ]);
    }
}
