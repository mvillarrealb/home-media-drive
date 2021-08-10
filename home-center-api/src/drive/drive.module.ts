import { Module } from '@nestjs/common';
import { DriveController } from './drive.controller';
import { DriveService } from './drive.service';
import { BucketsController } from './buckets/buckets.controller';
import { BucketsService } from './buckets/buckets.service';
import { StorageService } from './storage/storage.service';
import { DomainModule } from 'src/domain/domain.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BucketRepository } from 'src/domain/bucket.repository';
import { ResourceRepository } from 'src/domain/resource.repository';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResourceRepository, 
      BucketRepository,
    ]),
    DomainModule.forRoot(),
    MulterModule.register()
  ],
  controllers: [DriveController, BucketsController],
  providers: [DriveService, BucketsService, StorageService]
})
export class DriveModule {}
