import { Message, MessageRepository } from "./post-message.usecase";

export class InMemoryMessageRepository implements MessageRepository {
   
    messages = new Map<number, Message>;
    save(msg: Message): Promise<void> {
        this._save(msg);
        return Promise.resolve();
    };

    getMessagesById(messageId: number) {
        return this.messages.get(messageId);
    }

    givenExistingMessages(messages: Message[]){
        messages.forEach(this._save.bind(this));
    }

    getAllOfUser(user: string): Promise<Message[]> {
    return Promise.resolve([...this.messages.values()]
    .filter(msg => msg.author === user));

    }
    private _save(msg: Message){
        this.messages.set(msg.id,msg);
    }
}