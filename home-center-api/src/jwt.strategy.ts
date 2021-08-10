import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './accounts/dto/jwt-payload';
import { AccountRepository } from './domain/account.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(AccountRepository)
    private readonly accountRepository: AccountRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.publicKey'),
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const { accountId, email, scopes } = payload;
    const account = await this.accountRepository.findByIdActive(accountId);
    if (!account) {
        throw new UnauthorizedException(`User account ${accountId} does not exists or it was disabled`);
    }
    return { accountId, email, scopes };
  }
}
