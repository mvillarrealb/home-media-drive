import { Injectable } from '@nestjs/common';
import { BucketRepository } from './bucket.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBucketDTO } from './dto/create-bucket.dto';
import { SearchBucketDTO } from './dto/search-bucket.dto';
import { Bucket } from './bucket.entity';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class BucketService {
  constructor(
    @InjectRepository(BucketRepository)
    private readonly repository: BucketRepository,
    private readonly uploadService: UploadService,
  ) {}
  listBuckets(searchBucketDTO: SearchBucketDTO): Promise<Bucket[]> {
    return this.repository.listBuckets(searchBucketDTO);
  }
  async createBucket(createBucketDTO: CreateBucketDTO): Promise<Bucket> {
    const bucket = await this.repository.createBucket(createBucketDTO);
    await this.uploadService.createBucket(bucket.bucketId);
    return bucket;
  }
  findBucket(id: string): Promise<Bucket> {
    return this.repository.findBucket(id);
  }
  async deleteBucket(id: string): Promise<void> {
    const bucket = await this.repository.findBucket(id);
    await this.repository.delete(bucket); 
  }
}
