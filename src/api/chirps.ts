import type { Request, Response } from "express";

export async function handlerChirpValidator(req: Request, res: Response) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        let messageObj;
        try {
            const parsedBody = JSON.parse(body);

            if (parsedBody.body.length <= 140) {
                res.status(200);
                messageObj = { valid: true };
            } else {
                res.status(400);
                messageObj = { error: "Chirp is too long" };
            }
        } catch (error) {
            res.status(400);
            messageObj = { error: "Something went wrong"};
        }

        res.send(JSON.stringify(messageObj));
    })
}