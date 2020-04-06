import { Injectable, InternalServerErrorException, Logger, HttpException } from "@nestjs/common";
import { BucketRepository } from "src/bucket/bucket.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { ResourceRepository } from "./resource.repository";
import { UploadService } from "../upload/upload.service";
import { Resource } from "./resource.entity";
import { CreateResourceDTO } from "./dto/create-resource.dto";
import { SearchResourceDTO } from "./dto/search-resource.dto";

@Injectable()
export class ResourceService {
  private logger: Logger = new Logger('ResourceService');
  constructor(
    @InjectRepository(BucketRepository)
    private readonly bucketRepository: BucketRepository,
    @InjectRepository(ResourceRepository)
    private readonly resourceRepository: ResourceRepository,
    private readonly uploadService: UploadService,
  ) {}
  async createResource(
    bucketId: string, 
    createResourceDTO: CreateResourceDTO,
    uploadedFile: any
  ): Promise<Resource> {
    try {
      const {
        originalname, mimetype, buffer, size
      } = uploadedFile;
      Object.assign(createResourceDTO, {
        fileName: originalname,
        mimeType: mimetype,
        resourceSize: size,
      })
      await this.bucketRepository.findBucket(bucketId);
      const resource = await this.resourceRepository.createResource(bucketId, createResourceDTO);
      await this.uploadService.upload(bucketId, resource.resourceId, buffer);
      return resource;
    } catch(error) {
      if(error instanceof HttpException) {
        throw error;
      } else {
        this.logger.error(`Error creating resource `, error.stack);
        throw new InternalServerErrorException(`Error ocurred creating the resource`);
      }
    }
  }

  listResources(searchResourceDTO: SearchResourceDTO): Promise<Resource[]> {
    return this.resourceRepository.listResources(searchResourceDTO);
  }

  async move(resourceId: string, targetBucket: string): Promise<Resource> {
    await this.bucketRepository.findBucket(targetBucket);
    return this.resourceRepository.move(resourceId, targetBucket);
  }

  async findResource(resourceId: string): Promise<Resource> {
    return this.resourceRepository.findResource(resourceId);
  }
}