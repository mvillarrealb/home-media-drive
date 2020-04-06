import { Entity, PrimaryColumn, Column, Unique, ManyToOne, BaseEntity } from "typeorm";
import { Bucket } from "../bucket/bucket.entity";
import { Exclude } from 'class-transformer'
@Entity()
@Unique('uniqueResourceName', ['bucketId', 'resourceName'])
export class Resource extends BaseEntity {
  @PrimaryColumn()
  resourceId: string;
  @Column()
  resourceName: string;
  @Column()
  resourceDescription: string;
  @Column()
  fileName: string;
  @Column()
  resourceSize: number;
  @Column()
  @Exclude()
  createdAt: Date;
  @Column()
  @Exclude()
  updatedAt: Date;
  @Column()
  mimeType: string;
  @ManyToOne(type => Bucket, bucket => bucket.resources, { eager: false })
  bucket: Bucket;
  
  @Column()
  bucketId: string;
}