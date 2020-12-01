import { Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, IsNull, Repository } from "typeorm";
import { User } from "./user.entity";
import { UserDto } from "./dto/user.dto";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async getById(id: number) {
        return await this.userRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            }
        })
    }

    async getByEmail(email: string) {
        return await this.userRepository.findOne({
            where: {
                email,
                deletedAt: IsNull()
            }
        })
    }

    async create(userDto: UserDto, entityManager: EntityManager) {
        let userRepository = entityManager.getRepository(User)
        let {
            email,
            name,
            photoUrl
        } = userDto
        return await userRepository.insert(
            new User({
                email,
                name,
                photoUrl,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        )
    }

    async update(id: number, userDto: UserDto, entityManager: EntityManager) {
        let userRepository = entityManager.getRepository(User)
        let {
            email,
            name,
            photoUrl
        } = userDto
        return await userRepository.update(
            id,
            {
                name,
                email,
                photoUrl,
                updatedAt: new Date()
            }
        )
    }
}