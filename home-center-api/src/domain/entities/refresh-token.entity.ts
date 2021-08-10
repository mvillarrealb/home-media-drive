import { BaseEntity, Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Account } from "./account";

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
    @PrimaryColumn({name: 'refresh_token_id', type: 'uuid' })
    @Generated('uuid')
    refreshTokenId: string;
    
    @Column({name: 'refresh_token'})
    refreshToken: string;

    @Column({ name: 'created_at',type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
  
    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;
    
    @Column({default: true})
    active: boolean;

    @ManyToOne(type => Account, account => account.tokens, { eager: false })
    @JoinColumn({ name : 'account_id'})
    account: Account;

    invalidate() {
       this.active = false;
       return this.save();
    }
}