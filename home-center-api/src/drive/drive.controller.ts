import { ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { HasAuthorityGuard } from 'src/common/guards/has-authority.guard';
import { DriveService } from './drive.service';
import { Response } from 'express';


@UseGuards(AuthGuard('jwt'), HasAuthorityGuard)
@Controller()
export class DriveController {

    constructor(
        private readonly driveService: DriveService,
    ) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(200)
    @UseInterceptors(FilesInterceptor('files', 20))
    @Post('buckets/:bucketId')
    uploadFiles(
        @CurrentUser() accountId: string,
        @Param('bucketId') bucketId: string,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        return this.driveService.uploadFiles(accountId, bucketId, files);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('buckets/:bucketId')
    listResources(
        @CurrentUser() accountId: string,
        @Param('bucketId') bucketId: string,
    ) {
        return this.driveService.listResources(accountId, bucketId)
    }

    
    @Get('buckets/:bucketId/:resourceId')
    async findResource(
        @CurrentUser() accountId: string,
        @Param('bucketId') bucketId: string,
        @Param('resourceId',ParseUUIDPipe) resourceId: string,
        @Res() response: Response
    ) {
        const readableStream = await this.driveService.findResource(accountId, bucketId, resourceId);
        return readableStream.pipe(response);
    }

    @Delete('buckets/:bucketId/:resourceId')
    async deleteResource(
        @CurrentUser() accountId: string,
        @Param('bucketId') bucketId: string,
        @Param('resourceId',ParseUUIDPipe) resourceId: string
    ) {
        return this.driveService.deleteResource(accountId, bucketId, resourceId);
    }
}
