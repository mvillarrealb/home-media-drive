import { Entity, BaseEntity, Unique, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Resource } from "../resource/resource.entity";

@Entity()
@Unique('uniqueBucketName', ['bucketName'])
export class Bucket extends BaseEntity {
  @PrimaryColumn()
  bucketId: string;
  @Column()
  bucketName: string;
  @Column()
  bucketDescription: string;
  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;
  @OneToMany(type => Resource, resource => resource.bucket, { eager: true })
  resources: Resource[];
}
