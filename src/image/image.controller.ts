import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { editFileName, imageFileFilter } from "src/utils/file-uploading.utils";
import { EntityManager } from "typeorm";
import { ImageDto } from "./dto/image.dto";
import { Image } from "./image.entity";
import { ImageService } from "./image.service";
import { diskStorage } from 'multer';
import { Request } from 'express';

@Controller('image')
export class ImageController {
    constructor(
        private imageService: ImageService,
        private entityManager: EntityManager
    ) {}

    @Get('/user/:id')
    async getAllByUserId(
        @Param('id') id: number,
    ): Promise<Image[]> {
        return await this.imageService.getAllByUserId(id)
    }

    @Get(':imgpath')
    seeUploadedFile(@Param('imgpath') image, @Res() res) {
      return res.sendFile(image, { root: './files' });
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
              destination: './files',
              filename: editFileName,
            }),
            fileFilter: imageFileFilter,
          }),
      )
    async createImage(
        @UploadedFile() file, 
        @Req() request: Request
    ) {
        let queryParams = { ...request.query }
        const response = {
            originalname: file.originalname,
            filename: file.filename,
          };
        await this.entityManager.transaction(async transactionManager => {
            return await this.imageService.create(
                parseInt(queryParams.user[0], 10), 
                response.filename,
                queryParams.title.toString(),
                transactionManager);
        });
        return response;
    }

    @Put(':id')
    async updateImage(
        @Param('id') id: number, 
        @Body() imageDto: ImageDto
    ) {
        return await this.entityManager.transaction(async transactionManager => {
            return await this.imageService.update(id, imageDto, transactionManager);
        });
    }

    @Delete(':id')
    async deleteClass(@Param('id') id: number) {
        return await this.entityManager.transaction(async transactionManager => {
            return await this.imageService.delete(id, transactionManager);
        });
    }
}