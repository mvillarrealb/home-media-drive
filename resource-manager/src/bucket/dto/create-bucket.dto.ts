import { Matches, MaxLength, IsString } from 'class-validator';

export class CreateBucketDTO {

  @IsString()
  @Matches(/[a-zA-Z0-9]+/g, {
    message: 'Bucket name must only contains letters and numbers and hyphens',
  })
  @MaxLength(200)
  bucketName: string;

  @IsString()
  @MaxLength(200)
  bucketDescription: string;
}