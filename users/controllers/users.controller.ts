import express from 'express';
import usersService from '../services/users.service';
import argon2 from 'argon2';
import Logger from "../util/logger";

class UsersController {

    async listUsers(req: express.Request, res: express.Response) {
        Logger.debug("Fetching Users from DB");
        const users = await usersService.list(100, 0);
        res.status(200).send(users);
    }

    async getUserById(req: express.Request, res: express.Response) {
        const user = await usersService.readById(req.params.userId);
        res.status(200).send(user);
    }

    async createUser(req: express.Request, res: express.Response) {
        req.body.password = await argon2.hash(req.body.password);
        const userId = await usersService.create(req.body);
        res.status(201).send({id: userId});
    }

    async patch(req: express.Request, res: express.Response) {
        if(req.body.password){
            req.body.password = await argon2.hash(req.body.password);
        }
        Logger.debug(await usersService.patchById(req.body));

        res.status(204).send(``);
    }

    async put(req: express.Request, res: express.Response) {
        req.body.password = await argon2.hash(req.body.password);
        Logger.debug(await usersService.updateById({id: req.params.userId, ...req.body}));

        res.status(204).send(``);
    }

    async removeUser(req: express.Request, res: express.Response) {
        Logger.debug(await usersService.deleteById(req.params.userId));
        res.status(204).send(``);
    }
}

export default new UsersController();