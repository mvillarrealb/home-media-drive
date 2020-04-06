import { Module } from '@nestjs/common';
import { BucketService } from './bucket.service';
import { BucketController } from './bucket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BucketRepository } from './bucket.repository';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    UploadModule,
    TypeOrmModule.forFeature([BucketRepository]),
  ],
  providers: [BucketService],
  controllers: [BucketController],
  exports: [],
})
export class BucketModule {}
