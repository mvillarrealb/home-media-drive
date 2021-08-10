import { IsNotEmpty } from "class-validator";

export class CreateBucketDTO {
    @IsNotEmpty()
    bucketName: string;
}