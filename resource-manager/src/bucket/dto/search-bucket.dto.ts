import { IsNotEmpty, IsOptional, IsInt, Min, Max} from 'class-validator';

export class SearchBucketDTO {
  @IsInt()
  @Min(1)
  @Max(20)
  @IsOptional()
  limit: number;
  
  @IsInt()
  @Min(0)
  @IsOptional()
  offset: number;
  
  @IsOptional()
  @IsNotEmpty()
  @Max(200)
  search: string;
}