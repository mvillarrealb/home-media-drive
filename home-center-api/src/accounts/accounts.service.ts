import { ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRepository } from 'src/domain/account.repository';
import { Account } from 'src/domain/entities/account';
import { RefreshTokenRepository } from 'src/domain/refresh-token.repository';
import { JwtPayload } from './dto/jwt-payload';

@Injectable()
export class AccountsService {
    private logger: Logger = new Logger('AccountsService');
    constructor(
        @InjectRepository(AccountRepository)
        private readonly accountRepository: AccountRepository,
        
        @InjectRepository(RefreshTokenRepository)
        private readonly refreshTokenRepository: RefreshTokenRepository,
        
        private readonly jwtService: JwtService,
    ) {}

    async getProfile(accountId: string) {
        return await this.accountRepository.findOne(accountId);
    }

    async updateProfile(accountId: string, name: string, lastName: string) {
        const { affected } = await this.accountRepository.update(accountId, { name, lastName });
        if(affected == 0) {
            throw new ConflictException('Could not update user profile');
        }
        return this.accountRepository.findOne(accountId);
    }

    async signUp(email: string, password: string) {
        const exists = await this.accountRepository.findByEmail(email);
        if(exists) {
            throw new ConflictException('The email is already registered');
        }
        const account = await Account.createAccount(email, password);
        return this.accountRepository.save(account);
    }

    async signIn(inputEmail: string, password: string) {
        const account = await this.accountRepository.findByEmail(inputEmail);
        if(!account) {
            throw new UnauthorizedException('Email or password is invalid');
        }
        const isValidPassword = await account.isValid(password);
        if(!isValidPassword) {
            throw new UnauthorizedException('Email or password is invalid');
        }
        return this.createAccessToken(account);
    }
    private async createAccessToken(account: Account) {
        const { email, scopes, accountId, name, lastName } = account;
        const scopeList = (scopes) ? scopes.map(it => it.scope) : [];
        const payload: JwtPayload = {
            name, 
            lastName,
            email,
            scopes: scopeList, 
            accountId,
        };
        const accessToken = this.jwtService.sign(payload);
        const { refreshToken } = await this.refreshTokenRepository.generateRefreshToken(account);
        this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);
        return {
            accessToken,
            refreshToken,
            accountId,
            payload
        };
    }
    async changePassword(accountId: string, oldPassword: string ,password: string): Promise<void> {
        const account = await this.accountRepository.findOne(accountId);
        if(!account) {
            throw new NotFoundException('Email or password is invalid');
        }
        await account.changePassword(oldPassword, password);
    }

    async exchangeRefreshToken(refreshToken: string) {
        const token = await this.refreshTokenRepository.findByRefreshToken(refreshToken);
        await token.invalidate();
        return this.createAccessToken(token.account);
    }
}
