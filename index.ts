#!/usr/bin/env node
import { FileSystemMessageRepository } from "./src/message.fs.repository";
import {
	PostMessageCommand,
	PostMessageUseCase,
	MessageRepository,
	DateProvider,
} from "./src/post-message.usecase";
import { Command } from "commander";
import { ViewTimelineUseCase } from "./src/view-timeline.usecase";

class RealDateProvider implements DateProvider {
	now: Date;
	getNow(): Date {
		return new Date();
	}
}

const messageRepository = new FileSystemMessageRepository();
const dateProvider = new RealDateProvider();
const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider);
const viewTimelineUseCase = new ViewTimelineUseCase(messageRepository, dateProvider);

const program = new Command();

program
	.version("1.0.0")
	.description("Crafty social network")
	.addCommand(
		new Command("post")
			.argument("<user>", "the current user")
			.argument("<message>", "the message to post")
			.action(async (user, message) => {
				const postMessageCommand: PostMessageCommand = {
					id: Math.floor(Math.random() * 10000),
					author: user,
					text: message,
				};
				try {
					await postMessageUseCase.handle(postMessageCommand);
					console.log("✅ Message posté.");
					process.exit(0);
				} catch (error) {
					console.error("❌", error);
					process.exit(1);
				}
			})
	)
	.addCommand(
		new Command("view")
			.argument("<user>", "the user to view the timeline of")
			.action(async (user) => {
				try {
					const timeline = await viewTimelineUseCase.handle({ user });
					console.table(timeline);
					process.exit(0);
				} catch (error) {
					console.error(error);
					process.exit(1);
				}
			})
	);

async function main() {
	await program.parseAsync();
}
main();
