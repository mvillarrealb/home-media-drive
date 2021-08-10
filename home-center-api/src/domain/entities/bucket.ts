import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Resource } from './resource';

@Entity('buckets')
export class Bucket extends BaseEntity {
    @PrimaryColumn({name: 'bucket_id', type: 'text' })
    bucketId: string;

    @Exclude()
    @Column({ name: 'account_id', type: 'uuid' })
    accountId: string;
    
    @Column()
    name: string;
    
    @Column({ nullable: true })
    description: string;

    @Column({ name: 'created_at',type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
  
    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;
    
    @Column({default: true})
    active: boolean;

    @OneToMany(type => Resource, resource => resource.bucket, { eager: false, cascade: true })
    resources: Resource[];

    constructor(partial: Partial<Bucket>) {
        super();
        Object.assign(this, partial);
    }

}