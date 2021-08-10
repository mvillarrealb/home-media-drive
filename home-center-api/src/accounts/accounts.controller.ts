import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Post, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { LoginDTO } from './dto/login.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AccountsController {

    constructor(
        private readonly accountService: AccountsService,
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('accounts/@me')
    getProfile(
        @CurrentUser() userId: string,
    ) {
        return this.accountService.getProfile(userId);
    }

    @HttpCode(202)
    @UseGuards(AuthGuard('jwt'))
    @Post('accounts/@me')
    updateProfile(
        @CurrentUser() userId: string,
        @Body(ValidationPipe) { name, lastName }: UpdateProfileDTO
    ) {
        return this.accountService.updateProfile(userId, name, lastName);
    }

    @Post('accounts/signup')
    signUp(@Body(ValidationPipe) { email, password}: LoginDTO) {
        return this.accountService.signUp(email, password);
    }
    
    @HttpCode(200)
    @Post('accounts/signin')
    signIn(@Body(ValidationPipe) { email, password }: LoginDTO) {
        return this.accountService.signIn(email, password);
    }

    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @Post('accounts/@me/password')
    changePassword(
    @CurrentUser() userId: string, 
    @Body(ValidationPipe) {password, oldPassword }: ChangePasswordDTO
    ) {
        return this.accountService.changePassword(userId, oldPassword, password);
    }

    @Post('oauth/token')
    @HttpCode(200)
    exchangeRefreshToken(@Body(ValidationPipe) { refreshToken }: RefreshTokenDTO) {
        return this.accountService.exchangeRefreshToken(refreshToken);
    }

}
