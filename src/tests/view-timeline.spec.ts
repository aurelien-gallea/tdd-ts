import { InMemoryMessageRepository } from "../message.inmemory.repository";
import { Message } from "../post-message.usecase";
import { ViewTimelineUseCase } from "../view-timeline.usecase";

describe("Feature: Viewing a personal timeline", () => {
    let fixture : Fixture;

    beforeEach(()=> {
        fixture = createFixture();
    })

    describe("Rule: Messages are shown in reverse chronological order", () => {
        test("Alice can view 2 messages she published in her timeline", async () => {
            await fixture.givenTheFollowingMessageExist([
                {
                    author : "Alice",
                    text: "my first message",
                    id: 1,
                    publishedAt : new Date("2024-02-07T16:28:00.000Z")
                },
                {
                    author : "Bob",
                    text: "hey i'm here",
                    id: 2,
                    publishedAt : new Date("2024-02-07T16:29:00.000Z")
                },
                {
                    author : "Alice",
                    text: "how are you all ?",
                    id: 3,
                    publishedAt : new Date("2024-02-11T16:28:00.000Z")
                },
                
            ]);
            fixture.givenNowIs(new Date("2024-02-07T16:30:00.000Z"))

            await fixture.whenUserSeesTheTimelineOf("Alice");

            await fixture.thenUserShouldSee([
                {
                    author : "Alice",
                    text: "how are you all ?",
                    publicationTime: "1 minute ago"
                },
                {
                    author : "Alice",
                    text: "my first message",
                    publicationTime: "2 minutes ago"
                },
            ])
        })
    })
})

const createFixture = () => {
    let timeline : {author: string, text: string, publicationTime: string}[];
    const messageRepository = new InMemoryMessageRepository();
    const viewTimelineUseCase = new ViewTimelineUseCase();
    return {
        givenTheFollowingMessageExist(messages: Message[]) {
            messageRepository.givenExistingMessages(messages);
        },
        givenNowIs(now: Date) {},
        async whenUserSeesTheTimelineOf(user : string) {
            timeline = await viewTimelineUseCase.handle({ user });
        },
        thenUserShouldSee(expectedTimeline: {author: string, text: string, publicationTime: string}[]) {
            expect(timeline).toEqual(expectedTimeline)
        }
    }
}

type Fixture = ReturnType<typeof createFixture>