import { IsString } from "class-validator";

export class CreateResourceDTO {
  //@IsString()
  resourceName: string;
  //@IsString()
  resourceDescription: string;
  fileName: string;
  mimeType: string;
  resourceSize: number;
}