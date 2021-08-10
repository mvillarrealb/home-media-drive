import { ConflictException, Logger, NotFoundException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Resource } from "./entities/resource";

@EntityRepository(Resource)
export class ResourceRepository extends Repository<Resource> {
    private logger: Logger = new Logger('ResourceRepository');

    async findById(resourceId: string, accountId: string) {
        const resource = await this.findOne({ resourceId, accountId });
        if(!resource) {
            throw new NotFoundException(`Requested resource does not exists`)
        }
        return resource;
    }

    async deleteResource(resourceId: string, accountId: string) {
        const { affected } = await this.delete({resourceId, accountId});
        if(affected == 0) {
            throw new ConflictException(`Could not delete resource ${resourceId}`);
        }
    }
}
