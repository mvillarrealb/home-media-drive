import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BucketRepository } from 'src/domain/bucket.repository';
import { Bucket } from 'src/domain/entities/bucket';
import { Resource } from 'src/domain/entities/resource';
import { ResourceRepository } from 'src/domain/resource.repository';
import { resolvePromise } from 'src/common/util/resolve-promise';
import { StorageService } from './storage/storage.service';
import { createHash } from 'crypto';
import { Readable } from 'stream';

@Injectable()
export class DriveService {
    private logger: Logger = new Logger('DriveService');
    constructor(
        private readonly storageService: StorageService,
        @InjectRepository(ResourceRepository)
        private readonly resourceRepository: ResourceRepository,
        @InjectRepository(BucketRepository)
        private readonly bucketRepository: BucketRepository
    ) {}
    async uploadFiles(
        accountId: string, 
        bucketId: string, 
        files: Array<Express.Multer.File>
    ) {
        if(files == null || files == undefined) {
            throw new BadRequestException(`No files uploaded`);
        } else if(files.length == 0) {
            throw new BadRequestException(`No files uploaded`);
        }
        const bucket = await this.bucketRepository.findById(bucketId, accountId);
        if(!bucket) {
            throw new NotFoundException('Requested bucket does not exists');
        }
        const uploadList = files.map(it => this.storageService.createResource(bucketId, it.originalname, it.buffer));
        
        const resources  = files.map(it => this.createResource(accountId, bucket, it));
        
        const responses = await Promise.all(uploadList);
                
        const [persistedResources, persistError] = await resolvePromise(this.resourceRepository.save(resources));
        
        if(persistError != null) {
            this.logger.error(`Error persisting resources to database with error ${persistError}`, persistError.stack)
            throw new InternalServerErrorException(`Error performing resource metadata registry`);
        }

        return persistedResources;
    }
    
    async listResources(
        accountId: string, 
        bucketId: string
    ) {
        const bucket = await this.bucketRepository.findOne({
            where: { bucketId, accountId },
            relations: ['resources'],
            select: ['bucketId','name']
        });
        if(!bucket) {
            throw new NotFoundException('Requested bucket does not exists');
        }
        return bucket;
    }
    
    async findResource(
        accountId: string, 
        bucketId: string, 
        resourceId: string
    ): Promise<Readable>  {
        const resource = await this.resourceRepository.findOne({ resourceId, accountId });
        if(!resource) {
            throw new NotFoundException('Requested resource does not exists');
        }
        return this.storageService.findResource(bucketId, resource.name);
    }

    async deleteResource(
        accountId: string, 
        bucketId: string, 
        resourceId: string
    ) {
        const resource = await this.resourceRepository.findOne({ resourceId, accountId });
        if(!resource) {
            throw new NotFoundException('Requested resource does not exists');
        }
        const { affected } = await this.resourceRepository.delete({ resourceId, accountId});
        if(affected == 0) {

        }
        this.storageService.deleteResource(bucketId, resource.name);
    }

    private createResource(
        accountId: string,
        bucket: Bucket, 
        file: Express.Multer.File
    ): Resource {
        const { originalname, mimetype, size, buffer } = file;
        const hashSum = createHash('sha256').update(buffer);
        const fileHash = hashSum.digest('hex');
        return new Resource({
            bucket,
            accountId,
            name: originalname,
            mimeType: mimetype,
            fileHash,
            size,
            storageRef: `/${bucket.bucketId}/${originalname}`
        });
    }
}
