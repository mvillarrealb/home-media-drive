import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseUUIDPipe, Post, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { HasAuthorityGuard } from 'src/common/guards/has-authority.guard';
import { CreateBucketDTO } from '../dto/create-bucket.dto';
import { BucketsService } from './buckets.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'), HasAuthorityGuard)
@Controller('buckets')
export class BucketsController {

    constructor(
        private bucketService: BucketsService,
    ) {}

    @Post()
    //@Roles('buckets.create')
    createBucket(
        @CurrentUser() accountId: string,
        @Body(ValidationPipe) { bucketName }: CreateBucketDTO
    ) {
        return this.bucketService.createBucket(accountId, bucketName);
    }
    
    @Get()
    //@Roles('buckets.list')
    listBuckets(
        @CurrentUser() accountId: string,
    ) {
        return this.bucketService.listBuckets(accountId);
    }
    
    @Delete(':bucketId')
    @Roles('buckets.delete')
    deleteBucket(
        @CurrentUser() accountId: string,
        @Param("bucketId", ParseUUIDPipe) bucketId: string
    ) {
        return this.bucketService.deleteBucket(accountId, bucketId);
    }
}
