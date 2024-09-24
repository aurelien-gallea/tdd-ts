import * as path from "path";
import * as fs from "fs";

import { Message, MessageRepository } from "./post-message.usecase";

export class FileSystemMessageRepository implements MessageRepository {
    
    private readonly messagePath = path.join(__dirname, "message.json");

    

	async save(message: Message): Promise<void> {
        const messages = await this.getMessage();
        messages.push(message)

        return fs.promises.writeFile(
            this.messagePath,
            JSON.stringify(messages)
        );
    }

    private async getMessage() : Promise<Message[]> {
        const data = await fs.promises.readFile(this.messagePath);
        const messages = JSON.parse(data.toString()) as {
            id: string;
            author: string;
            text: string;
            publishedAt: string;
        }[];

        return messages.map((m) => ({
            id: Number(m.id),
            author: m.author,
            text: m.text,
            publishedAt: new Date(m.publishedAt)
        }))
    }

   async getAllOfUser(user: string): Promise<Message[]> {
        const messages = await this.getMessage();
        return messages.filter(m => m.author === user);
    }
}
