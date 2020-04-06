import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceModule } from './resource/resource.module';
import { BucketModule } from './bucket/bucket.module';
import { UploadModule } from './upload/upload.module';
import { TypeOrmConfig } from './config/type-orm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    ResourceModule,
    BucketModule,
    UploadModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
