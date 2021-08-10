import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Bucket } from './bucket';

@Entity('resources')
export class Resource extends BaseEntity {
    
    @PrimaryColumn({name: 'resource_id', type: 'uuid' })
    @Generated('uuid')
    resourceId: string;

    @Exclude()
    @Column({type: 'uuid'})
    accountId: string;

    @Column()
    name: string;
    
    @Column()
    mimeType: string;
    
    @Column()
    size: number;

    @Column()
    fileHash: string;

    @Column({ name: 'storage_ref' })
    storageRef: string;
    
    @Column({ name: 'created_at',type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
  
    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;
    
    @Column({ default: true})
    active: boolean;

    @Exclude()
    @ManyToOne(type => Bucket, bucket => bucket.resources, { eager: false })
    @JoinColumn({ name : 'bucket_id'})
    bucket: Bucket;

    constructor(partial: Partial<Resource>) {
        super();
        Object.assign(this, partial);
    }
}