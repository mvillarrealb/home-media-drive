import { Controller, Post, Get, Patch, UploadedFile, Param, Body, ParseUUIDPipe, ValidationPipe, UseInterceptors, Query, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Resource } from './resource.entity';
import { SearchResourceDTO } from './dto/search-resource.dto';
import { CreateResourceDTO } from './dto/create-resource.dto';
import { ResourceService } from './resource.service';

@Controller()
export class ResourceController {
  constructor(
    private readonly resourceService: ResourceService,
  ) {}
  @Post('buckets/:bucketId')
  @UseInterceptors(FileInterceptor('file'))
  createResource(
    @Param('bucketId', ParseUUIDPipe) bucketId: string, 
    @Body(ValidationPipe) createResourceDTO: CreateResourceDTO,
    @UploadedFile('file') file
  ): Promise<Resource> {
    if(file == null) {
      throw new BadRequestException(`A file was expected in the request body`);
    }
    return this.resourceService.createResource(bucketId, createResourceDTO, file);
  }

  @Get('resources')
  listResources(@Query(ValidationPipe)searchResourceDTO: SearchResourceDTO): Promise<Resource[]> {
    return this.resourceService.listResources(searchResourceDTO);
  }

  @Patch('resources/:resourceId/:targetBucket')
  move(
    @Param('resourceId',ParseUUIDPipe) resourceId: string, 
    @Param('targetBucket',ParseUUIDPipe) targetBucket: string
  ): Promise<Resource> {
    return this.resourceService.move(resourceId, targetBucket);
  }
  @Get('resources/:resourceId')
  findResource(@Param('resourceId', ParseUUIDPipe)resourceId: string): Promise<Resource> {
    return this.resourceService.findResource(resourceId);
  }
}
