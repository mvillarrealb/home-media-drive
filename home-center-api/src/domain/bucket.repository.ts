import { ConflictException, InternalServerErrorException, Logger } from "@nestjs/common";
import { resolvePromise } from "src/common/util/resolve-promise";
import { EntityRepository, Repository } from "typeorm";
import { Bucket } from "./entities/bucket";

@EntityRepository(Bucket)
export class BucketRepository extends Repository<Bucket> {
    private logger: Logger = new Logger('BucketRepository');

    async createBucket(bucketId: string ,accountId: string, bucketName: string) {
        const exists = await this.findByName(accountId, bucketName);
        if(exists) {
            throw new ConflictException(`A bucket with ${bucketName} already exists`);
        }
        const [response, error] = await resolvePromise(this.save(new Bucket({bucketId, accountId, name: bucketName})));
        if(error != null) {
            throw new InternalServerErrorException(`Error creating bucket metadata`);
        }
        return response;
    }
    
    findById(bucketId: string, accountId: string): Promise<Bucket> {
        return  this.findOne({ where: { accountId, bucketId }});
    }
    
    findByName(accountId: string, name: string): Promise<Bucket> {
        return this.findOne({ where: { accountId, name }});
    }
}