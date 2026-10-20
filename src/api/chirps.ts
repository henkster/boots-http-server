import type { Request, Response } from "express";

export async function handlerChirpValidator(req: Request, res: Response) {
    type parameters ={
        body: string;
    }

    const params: parameters = req.body;

    let messageObj;

    if (params.body.length <= 140) {
        res.status(200);
        messageObj = { valid: true };
    } else {
        res.status(400);
        messageObj = { error: "Chirp is too long" };
    }

    res.send(JSON.stringify(messageObj));
}