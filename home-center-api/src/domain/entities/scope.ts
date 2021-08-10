import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity('scopes')
export class Scope extends BaseEntity {
    @PrimaryColumn({name: 'scope', length: 200 })
    scope: string;
    
    @Column()
    description: string;
}