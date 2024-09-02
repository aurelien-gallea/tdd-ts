import { Message, MessageRepository } from "./post-message.usecase";

export class InMemoryMessageRepository implements MessageRepository {
    messages = new Map<number, Message>;
    save(msg: Message): Promise<void> {
        this.messages.set(msg.id, msg);

        return Promise.resolve();
    };

    getMessagesById(messageId: number) {
        return this.messages.get(messageId);
    }
    givenExistingMessages(messages: Message[]){
        messages.forEach(msg => this.messages.set(msg.id, msg))
    }
}