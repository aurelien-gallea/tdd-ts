#!/usr/bin/env node
import { FileSystemMessageRepository } from './src/message.fs.repository';
import { InMemoryMessageRepository } from './src/message.inmemory.repository';
import { PostMessageCommand, PostMessageUseCase, MessageRepository, DateProvider } from './src/post-message.usecase';
import { Command } from "commander";

class RealDateProvider implements DateProvider {
    getNow(): Date {
       return new Date(); 
    }
}

const messageRepository = new FileSystemMessageRepository();
const dateProvider = new RealDateProvider();
const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider);
const program = new Command();

program
    .version("1.0.0")
    .description("Crafty social network")
    .addCommand(new Command("post")
        .argument("<User>", "the current user")
        .argument("<message>", "the message to post")
        .action(async (user, message) => {
            const postMessageCommand: PostMessageCommand = {
                id : 0,
                author : user,
                text : message
            }
            try {
               await postMessageUseCase.handle(postMessageCommand)
                console.log("✅ Message posté.");              
                process.exit(0);
                
            } catch (error) {
                console.error("❌",error);
                process.exit(1);
            }
        })
)
async function main() {
        await program.parseAsync();
}
main();