import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { dump } from 'js-yaml';
import { Logger } from '@nestjs/common';
/**
 * Start sandbox and returns sandboxed yaml
 * @returns Sandbox yaml
 */
export async function startSandbox(): Promise<string> {
    const logger = new Logger('TestContainersSandbox');
    const accessKey = 'minio';
    const secretKey = 'minio1234';
    const username = 'postgres';
    const password = 'casa1234';
    logger.log(`Starting postgresql container...`);
    const database: StartedTestContainer = await new GenericContainer("postgres:12-alpine")
                        .withExposedPorts(5432)
                        .withEnv("POSTGRES_USER", username)
                        .withEnv("POSTGRES_PASSWORD", password)
                        .withEnv("POSTGRES_DB", "home_center")
                        .start();
    logger.log(`Started postgresql container`);
    
    logger.log(`Starting minio container...`);
    const storage: StartedTestContainer = await new GenericContainer("minio/minio")
    .withExposedPorts(9000)
    .withCmd(["server", "/data"])
    .withEnv("MINIO_ACCESS_KEY", accessKey)
    .withEnv("MINIO_SECRET_KEY", secretKey)
    .start();
    logger.log(`Started minio container`);
    logger.log(`Returning sandboxed yaml`);
    return dump({
        http: {
            port: 8080,
            "rate-limit": {
                ttl: 60,
                limit: 200
            }
        },
        db: {
            host: database.getHost(),
            port: database.getMappedPort(5432),
            database: 'home_center',
            username,
            password
        },
        jwt: {
            publicKey: '123456789101112',
            expiresIn: '1h',
        },
        storage: {
            endPoint: database.getHost(),
            port: storage.getMappedPort(9000),
            useSSL: false,
            accessKey,
            secretKey
        }
    });
};