import { messageBuilder } from "./message.builder";
import { createMessagingFixture, MessagingFixture } from "./messaging.fixture";

describe("Feature: editing a message", () => {
	let fixture: MessagingFixture;

	beforeEach(() => {
		fixture = createMessagingFixture();
	});
	describe("Rule: The Edited text should not be superior to 280 characters", () => {
		xtest("Alice can edit her message to a text inferior to 280 characters", async () => {
			const aliceMessageBuilder = messageBuilder()
                .withId(1)
                .authoredBy("Alice")
                .withText("Hello wrld");
            fixture.givenTheFollowingMessageExist([
                aliceMessageBuilder.build()	
			]);

			await fixture.whenUserEditMessage({
				messageId: 3,
				text: "Hello World",
			});

			fixture.thenMessageShouldBe(
                aliceMessageBuilder.withText("Hello World").build()
            );
		});
	});
});
