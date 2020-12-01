import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { EntityManager } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { User } from "./user.entity";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private entityManager: EntityManager
    ) {}

    @Get(':id')
    async getOneUser(
        @Param('id') id: number,
    ): Promise<User> {
        return await this.userService.getById(id)
    }

    @Get('/email/:email')
    async getOneByEmail(
        @Param('email') email: string,
    ): Promise<User> {
        return await this.userService.getByEmail(email)
    }

    @Post()
    async createUser(@Body() userDto: UserDto) {
        let userExists = await this.getOneByEmail(userDto.email)
        if(userExists) {
            throw new BadRequestException('Já existe um usuário cadastrado com este e-mail')
        }
        return await this.entityManager.transaction(async transactionManager => {
            return await this.userService.create(userDto, transactionManager);
        });
    }

    @Put(':id')
    async updateClass(
        @Param('id') id: number, 
        @Body() userDto: UserDto
    ) {
        return await this.entityManager.transaction(async transactionManager => {
            return await this.userService.update(id, userDto, transactionManager);
        });
    }
}