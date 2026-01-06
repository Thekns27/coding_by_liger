
import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'src/generated/client';




@Injectable()
export class PrismaService extends PrismaClient {
    constructor () {
        super ({})
    }
}
