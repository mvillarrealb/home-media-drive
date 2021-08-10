import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountRepository } from 'src/domain/account.repository';
import { RefreshTokenRepository } from 'src/domain/refresh-token.repository';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountRepository, 
      RefreshTokenRepository,
    ]),
  ],
  controllers: [AccountsController],
  providers: [AccountsService,]
})
export class AccountsModule {}
