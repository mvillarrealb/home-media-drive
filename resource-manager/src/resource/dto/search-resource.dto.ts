import { IsNotEmpty, IsOptional, IsInt, Min, Max, IsEnum} from 'class-validator';

export class SearchResourceDTO {
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
  
  //@IsEnum(FileType, { each: true })
  fileTypes: string[];
}