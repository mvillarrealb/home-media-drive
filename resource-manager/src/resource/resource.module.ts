import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceController } from './resource.controller';
import { BucketModule } from '../bucket/bucket.module';
import { UploadModule } from '../upload/upload.module';
import { ResourceRepository } from './resource.repository';
import { BucketRepository } from '../bucket/bucket.repository';
import { ResourceService } from './resource.service';


@Module({
  imports: [
    BucketModule,
    UploadModule,
    TypeOrmModule.forFeature([BucketRepository,ResourceRepository])
  ],
  controllers: [ResourceController],
  providers: [ResourceService]
})
export class ResourceModule {}
