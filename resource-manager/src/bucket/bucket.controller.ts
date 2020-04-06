import { Controller, Get, Post, Delete, Query, Body, Param, ValidationPipe, ParseUUIDPipe, UsePipes } from '@nestjs/common';
import { SearchBucketDTO } from './dto/search-bucket.dto';
import { CreateBucketDTO } from './dto/create-bucket.dto';
import { Bucket } from './bucket.entity';
import { BucketService } from './bucket.service';

@Controller('buckets')
export class BucketController {
  constructor(
    private readonly bucketService: BucketService,
  ) {}
  @Get()
  listBuckets(@Query(ValidationPipe) searchBucketDTO: SearchBucketDTO): Promise<Bucket[]> {
    return this.bucketService.listBuckets(searchBucketDTO);
  }
  @Post()
  createBucket(@Body(ValidationPipe) createBucketDTO: CreateBucketDTO): Promise<Bucket> {
    return this.bucketService.createBucket(createBucketDTO);
  }
  @Get(':id')
  findBucket(@Param('id', ParseUUIDPipe) id: string): Promise<Bucket> {
    return this.bucketService.findBucket(id);
  }
  @Delete(':id')
  deleteBucket(@Param('id', ParseUUIDPipe)id: string): Promise<void> {
    return this.bucketService.deleteBucket(id);
  }
}
