import { Injectable, Logger } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Account } from "./entities/account";


@Injectable()
@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
    private logger: Logger = new Logger('AccountRepository');
    constructor() {
        super();
    }
    findByEmail(email: string) {
        this.logger.log(`Finding Email ${email}`);
        return this.findOne({ where: { email } });
    }
    findByIdActive(accountId: string) {
        return this.findOne({ where: { accountId, active: true}, cache: true });
    }
}