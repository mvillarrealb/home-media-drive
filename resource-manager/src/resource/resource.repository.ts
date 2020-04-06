import { v4 as uuid } from 'uuid';
import { Repository, EntityRepository } from "typeorm";
import { Resource } from "./resource.entity";
import { CreateResourceDTO } from "./dto/create-resource.dto";
import { SearchResourceDTO } from "./dto/search-resource.dto";
import { ConflictException, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';

@EntityRepository(Resource)
export class ResourceRepository extends Repository<Resource> {
  private logger: Logger = new Logger('ResourceRepository');
  async createResource(
    bucketId: string, 
    createResourceDTO: CreateResourceDTO
  ): Promise<Resource> {
    const resource = new Resource();
    resource.resourceId = uuid();
    resource.bucketId = bucketId;
    resource.createdAt = new Date();
    resource.updatedAt = new Date();
    Object.assign(resource, createResourceDTO);
    try {
      await this.save(resource);
    } catch(error) {
      this.logger.error(`Error creating resource `, error.stack)
      if (error.code === '23505') {// Duplicate error
        throw new ConflictException(`Resource with name ${JSON.stringify(createResourceDTO)} already exists on bucket ${bucketId}`);
      } else {
          throw new InternalServerErrorException();
      }
    }
    return resource;
  }
  
  listResources(searchResourceDTO: SearchResourceDTO): Promise<Resource[]> {
    const { limit, offset, fileTypes, search} = searchResourceDTO;
    const query = this.createQueryBuilder('resource');
    if(search) {
      query.andWhere('(resource.resourceName LIKE :search OR resource.resourceDescription LIKE :search)', { search: `%${search}%` })
    }
    if (fileTypes) {}
    if (limit) {
      query.limit(limit);
    }
    if (offset) {
      query.offset(offset);
    }
    try {
      return query.getMany();
    } catch(error) {
      throw new InternalServerErrorException();
    }

  }

  async move(resourceId: string, targetBucket: string): Promise<Resource> {
    const resource = await this.findResource(resourceId);
    if(resource.bucketId != targetBucket) {
      resource.bucketId = targetBucket;
      resource.updatedAt = new Date();
      resource.save();
    }
    return resource;
  }
  async findResource(resourceId: string): Promise<Resource> {
    const resource = await this.findOne(resourceId);
    if(resource == null) { 
      throw new NotFoundException(`Resource with identifier ${resourceId} does not exists`);
    }
    return resource;
  }
  
}
