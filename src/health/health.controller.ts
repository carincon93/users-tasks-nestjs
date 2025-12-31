import { Controller, Get } from "@nestjs/common";
import { HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator } from "@nestjs/terminus";
import { ConfigService } from '@nestjs/config'

@Controller("health")
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private config: ConfigService,
        private http: HttpHealthIndicator,
        private db: TypeOrmHealthIndicator
    ) { }

    @Get("/")
    check() {
        console.log(this.config.get('api.url'));
        console.log(this.config.get('api.port'));
        return this.health.check([
            () => this.http.pingCheck('api', `${this.config.get('api.url')}:${this.config.get('api.port')}/docs`, { timeout: 1000 }),
            () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com', { timeout: 1000 }),
            () => this.db.pingCheck('database', { timeout: 1000 }),
        ]);
    }
}