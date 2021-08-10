import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ClientOptions } from 'minio';
import { resolvePromise } from 'src/common/util/resolve-promise';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
    private client: Client;

    constructor(
        private readonly configService: ConfigService,
    ) {
        const config = this.configService.get<ClientOptions>('storage');
        this.client = new Client(config);
    }

    async createBucket(
        bucketName: string, 
        bucketId: string, region = 'us-east-1'
    ): Promise<void> {
        const exists = await this.findBucket(bucketId);
        if(exists) {
            throw new ConflictException(`Bucket ${bucketName} already exists`);
        }
        const [result, error] = await resolvePromise(this.client.makeBucket(bucketId, region));
        if(error != null) {
            throw new InternalServerErrorException(`Error creating bucket storage block`);
        }
        return result;
    }
    
    findBucket(bucketName: string): Promise<boolean> {
        return this.client.bucketExists(bucketName);
    }
    
    findResource(bucketId: string, resourceName: string): Promise<Readable> {
        return this.client.getObject(bucketId, resourceName);
    }

    deleteResource(bucketId: string, resourceName: string): Promise<void> {
        return this.client.removeObject(bucketId, resourceName);
    }

    async createResource(
        bucketId: string, 
        resourceName: string, 
        resource: Buffer
    ): Promise<string> {
        const exists = await this.findBucket(bucketId);
        if(!exists) {
            throw new NotFoundException(`Bucket ${bucketId} does not exists`);
        }
        const [response, storageError] = await resolvePromise(this.client.putObject(bucketId, resourceName, resource));
        if(storageError != null) {
            throw new InternalServerErrorException(`Error performing resource upload`);
        }
        return response;
    }
    
    async removeBucket(bucketName: string): Promise<void> {
        const exists = await this.findBucket(bucketName);
        if(!exists) {
            throw new NotFoundException('The requested bucket does not exists');
        }
        return this.client.removeBucket(bucketName);
    }

}
