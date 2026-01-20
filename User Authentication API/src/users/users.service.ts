import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

    findAll() {
        return "find all"
    }

    findById() {
        return "find by id"
    }
    create() {
        return "this is crete"
    }
    update() {
        return "this is update"
    }
    delete() {
        return "delete successfully"
    }
}
