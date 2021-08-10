import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheckService, HttpHealthIndicator, MemoryHealthIndicator, HealthCheck, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { ClientOptions } from 'minio';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: TypeOrmHealthIndicator,
        private memory: MemoryHealthIndicator,
        private http: HttpHealthIndicator,
        private configService: ConfigService,
    ) {}
    
    @Get()
    @HealthCheck()
    check() {
        const config = this.configService.get<ClientOptions>('storage');
        const pingURL = `${config.endPoint}:${config.port}/minio/health/live`
        /* /minio/health/live */
        return this.health.check([
            () => this.db.pingCheck('database'),
            () => this.memory.checkHeap('memory', 256),
            () => this.http.pingCheck('minioStatus', pingURL, {})
        ]);
    }
}
