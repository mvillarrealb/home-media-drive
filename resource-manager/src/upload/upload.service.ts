import { Injectable, Logger } from '@nestjs/common';
import { Client, ClientOptions } from 'minio';
import * as config from 'config';
import { promisify } from 'util';

@Injectable()
export class UploadService {
  private logger: Logger = new Logger('UploadService');
  private client: Client;
  constructor() {
    const clientOptions = config.get<ClientOptions>('object-store')
    this.client = new Client(clientOptions);
  }
  async createBucket(bucketId: string): Promise<void> {
    const makeBucket = promisify(this.client.makeBucket).bind(this.client);
    this.logger.log(`Creating Bucket with Id ${bucketId}`);
    await makeBucket(bucketId, 'us-east-1');
    this.logger.log(`Created Bucket with Id ${bucketId}`);
  }
  async upload(bucketId: string, resourceId: string, uploadFile): Promise<void> {
    const putObject = promisify(this.client.putObject).bind(this.client);
    await putObject(bucketId, resourceId, uploadFile);
  }
  download(bucketId: string, resourceId: string) {
    const getObject = promisify(this.client.getObject).bind(this.client);
    return getObject(bucketId, resourceId);
  }
}
