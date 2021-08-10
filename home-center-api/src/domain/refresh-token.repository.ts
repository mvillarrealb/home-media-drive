import { Logger, UnauthorizedException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Account } from "./entities/account";
import { RefreshToken } from "./entities/refresh-token.entity";
import { genSalt } from 'bcrypt';

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {
    private logger: Logger = new Logger('RefreshTokenRepository');

    async findByRefreshToken(refreshToken: string) {
        const token = await this.findOne({
            relations: ['account'],
            where: { refreshToken, active: true } 
        });
        this.logger.log(`Got result from repository ${token}`);
        if(!token) {
            throw new UnauthorizedException('Invalid or inactive access token');
        }
        return token;
    }

    async generateRefreshToken(account: Account) {
        const refreshToken = new RefreshToken();
        refreshToken.account = account;
        refreshToken.refreshToken = await genSalt();
        return this.save(refreshToken);
    }

}