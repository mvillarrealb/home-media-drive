import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AccountsModule } from './accounts/accounts.module';
import { DriveModule } from './drive/drive.module';
import { JwtStrategy } from './jwt.strategy';
import { DomainModule } from './domain/domain.module';
import { AccountRepository } from './domain/account.repository';
import { HealthController } from './health/health.controller';


import configuration from './configuration';

@Module({
  imports: [
    TerminusModule,
    {
      ...ThrottlerModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          ttl: config.get('http.rate-limit.ttl'),
          limit: config.get('http.rate-limit.limit'),
        }),
      }),
      global: true
    },
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([AccountRepository]),
    { ...DomainModule.forRoot(), global: true },
    { ...ConfigModule.forRoot({ load: [configuration] }), global: true },
    {
      ...JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get<string>('jwt.publicKey'),
          signOptions: {
            expiresIn: configService.get<string>('jwt.expiresIn'),
          },
        })
      }),
      global: true
    },
    AccountsModule, 
    DriveModule,
  ],
  controllers: [HealthController],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  exports: [PassportModule, ThrottlerModule, ConfigModule, DomainModule]
})
export class AppModule {}
