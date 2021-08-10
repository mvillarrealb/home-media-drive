import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BucketRepository } from 'src/domain/bucket.repository';
import { StorageService } from '../storage/storage.service';
import { createHash } from 'crypto';

@Injectable()
export class BucketsService {
    constructor(
        @InjectRepository(BucketRepository)
        private bucketRepository: BucketRepository,
        private storageService: StorageService
    ) {}
    async createBucket(accountId: string, bucketName: string) {
        const bucketId = createHash('md5').update(`${accountId}:${bucketName}`).digest('hex');
        await this.storageService.createBucket(bucketName, bucketId);        
        return this.bucketRepository.createBucket(bucketId, accountId, bucketName);
    }

    listBuckets(accountId: string) {
        return this.bucketRepository.find({ where: { accountId }});
    }

    async updateBucket(accountId: string, bucketId: string, name: string, description: string) {
        const { affected } = await this.bucketRepository.update({accountId, bucketId}, {name, description})
        if(affected == 0) {
            throw new ConflictException('Could not update bucket');
        }
    }

    async deleteBucket(accountId: string, bucketId: string) {
        const { affected } = await this.bucketRepository.delete({ accountId, bucketId });
        if(affected == 0) {
            throw new ConflictException('Could not delete bucket');
        }
        this.storageService.removeBucket(bucketId);
    }
}
