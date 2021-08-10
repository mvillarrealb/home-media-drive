import { IsNotEmpty } from "class-validator";

export class UpdateProfileDTO {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    lastName: string;
}