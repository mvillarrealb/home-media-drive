import { BaseEntity, Column, Entity, Generated, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm'
import { genSalt, hash } from 'bcrypt';
import { Scope } from './scope';
import { Exclude } from 'class-transformer';
import { UnauthorizedException } from '@nestjs/common';
import { RefreshToken } from './refresh-token.entity';

@Entity('accounts')
export class Account extends BaseEntity {
    @PrimaryColumn({name: 'account_id', type: 'uuid' })
    @Generated('uuid')
    accountId: string;
    
    @Column({ nullable: true })
    name: string;
    
    @Column({name: 'last_name', nullable: true })
    lastName: string;
    
    @Column()
    email: string;
    
    @Column()
    @Exclude()
    password: string;

    @Column()
    @Exclude()
    salt: string;

    @Column({ name: 'created_at',type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
  
    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;
    
    @Column({default: true})
    active: boolean;

    @ManyToMany(() => Scope)
    @JoinTable({ name: 'account_scopes',
        joinColumn: {
            name: 'account_id',
            referencedColumnName: 'accountId'
        },
        inverseJoinColumn: {
            name: 'scope',
            referencedColumnName: 'scope'
        }
    })
    scopes: Scope[];

    @OneToMany(type => RefreshToken, token => token.account, { eager: false, cascade: true })
    tokens: RefreshToken[];

    constructor(partial: Partial<Account>) {
        super();
        Object.assign(this, partial);
    }

    static async createAccount(email: string, password: string) {
        const salt = await genSalt();
        const account = new Account({ email, salt });
        account.password = await hash(password, account.salt);
        return account;
    }
    async changePassword(oldPassword: string , password: string) {
        const oldPasswordMatches = await this.isValid(oldPassword);
        if(!oldPasswordMatches) {
            throw new UnauthorizedException('Old password does not match');
        }
        this.salt = await genSalt();
        this.password = await hash(password, this.salt);
        this.save();
    }
    /**
     * 
     * @param password 
     * @returns 
     */
    async isValid(password: string): Promise<boolean> {
        const hashed = await hash(password, this.salt);
        return (hashed == this.password);
    }
}