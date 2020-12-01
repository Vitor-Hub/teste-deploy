import { Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, IsNull, Repository } from "typeorm";
import { Image } from "./image.entity";
import { ImageDto } from "./dto/image.dto";

@Injectable({ scope: Scope.REQUEST })
export class ImageService {
    constructor(
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>
    ) {}

    async getAllByUserId(userId: number) {
        return await this.imageRepository.find({
            where: {
                userId,
                deletedAt: IsNull()
            }
        })
    }

    async create(
        userId: number, 
        fileName: string,
        title: string,
        entityManager: EntityManager) {
        let imageRepository = entityManager.getRepository(Image)
        return await imageRepository.insert(
            new Image({
                imageUrl: fileName,
                title,
                userId,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        )
    }

    async update(
        id: number, 
        imageDto: ImageDto, 
        entityManager: EntityManager
    ) {
        let imageRepository = entityManager.getRepository(Image)
        let {
            title
        } = imageDto
        return await imageRepository.update(
            id,
            {
                title,
                updatedAt: new Date()
            }
        )
    }

    async delete(id: number, entityManager: EntityManager) {
        let imageRepository = entityManager.getRepository(Image)
        return await imageRepository.update(
            id, 
            { deletedAt: new Date(), updatedAt: new Date() }
        )
    }
}