import { v4 as uuid } from 'uuid';
import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException, NotFoundException, Logger, Injectable } from '@nestjs/common';
import { Bucket } from './bucket.entity';
import { CreateBucketDTO } from './dto/create-bucket.dto';
import { SearchBucketDTO } from './dto/search-bucket.dto';


@EntityRepository(Bucket)
export class BucketRepository extends Repository<Bucket> {
  private logger: Logger = new Logger('BucketRepository');
  listBuckets(searchBucketDTO: SearchBucketDTO): Promise<Bucket[]> {
    const { limit, offset, search } = searchBucketDTO;
    const query = this.createQueryBuilder('bucket');
    if(search) {
      query.andWhere('(bucket.bucketName LIKE :search OR bucket.bucketDescription LIKE :search)', { search: `%${search}%` })
    }
    if(limit) {
      query.limit(limit);
    }
    if(offset) {
      query.offset(offset);
    }
    try {
      return query.getMany();
    } catch(error) {
      throw new InternalServerErrorException();
    }
  }

  async createBucket(createBucket: CreateBucketDTO): Promise<Bucket> {
    const { bucketName, bucketDescription } = createBucket;
    const bucket = new Bucket();
    Object.assign(bucket, {
      bucketId: uuid(),
      bucketName,
      bucketDescription,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    try {
      await this.save(bucket);
    } catch (error) {
      this.logger.error(`Failed to create bucket. Data: ${JSON.stringify(bucket)}`, error.stack);
      if (error.code === '23505') {// Duplicate error
          throw new ConflictException(`Bucket with name ${bucketName} already exists`);
      } else {
          throw new InternalServerErrorException();
      }
    }
    return bucket;
  }
  
  async findBucket(bucketId: string): Promise<Bucket> {
    const bucket = await this.findOne(bucketId)
    if( bucket === null) {
      throw new NotFoundException('The requested bucket does not exists');
    }
    return bucket;
  }
}
