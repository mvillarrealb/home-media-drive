import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account';
import { Bucket } from './entities/bucket';
import { RefreshToken } from './entities/refresh-token.entity';
import { Resource } from './entities/resource';
import { Scope } from './entities/scope';

@Module({})
export class DomainModule {
    static forRoot(): DynamicModule {
        return {
          imports: [
            TypeOrmModule.forRootAsync({
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => ({
                    type: 'postgres',
                    host: configService.get('db.host'),
                    port: +configService.get<number>('db.port'),
                    username: configService.get('db.username'),
                    password: configService.get('db.password'),
                    database: configService.get('db.database'),
                    entities: [ Scope, RefreshToken, Account, Bucket, Resource ],
                    synchronize: true,
                  }),
                  inject: [ConfigService],
            }),
          ],
          module: DomainModule,
          providers: [],
          exports: [
            TypeOrmModule,
          ],
        };
      }
}
