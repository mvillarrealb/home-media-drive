import { IsNotEmpty } from "class-validator";

export class ChangePasswordDTO {
    @IsNotEmpty()
    oldPassword: string;
    
    @IsNotEmpty()
    password: string;
}