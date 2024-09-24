import { createMessagingFixture, MessagingFixture } from "./messaging.fixture";

describe("Feature: Viewing a personal timeline", () => {
	let fixture: MessagingFixture;

	beforeEach(() => {
		fixture = createMessagingFixture();
	});

	describe("Rule: Messages are shown in reverse chronological order", () => {
		test("Alice can view 3 messages she published in her timeline", async () => {
			await fixture.givenTheFollowingMessageExist([
				{
					author: "Alice",
					text: "my first message",
					id: 1,
					publishedAt: new Date("2024-02-07T16:28:00.000Z"),
				},
				{
					author: "Bob",
					text: "hey i'm here",
					id: 2,
					publishedAt: new Date("2024-02-07T16:29:00.000Z"),
				},
				{
					author: "Alice",
					text: "how are you all ?",
					id: 3,
					publishedAt: new Date("2024-02-11T16:28:00.000Z"),
				},
				{
					author: "Alice",
					text: "My last message",
					id: 4,
					publishedAt: new Date("2024-02-11T16:30:30.000Z"),
				},
			]);
			fixture.givenNowIs(new Date("2024-02-07T16:30:00.000Z"));

			await fixture.whenUserSeesTheTimelineOf("Alice");

			await fixture.thenUserShouldSee([
				{
					author: "Alice",
					text: "My last message",
					publicationTime: "less than a minute ago",
				},
				{
					author: "Alice",
					text: "how are you all ?",
					publicationTime: "1 minute ago",
				},
				{
					author: "Alice",
					text: "my first message",
					publicationTime: "2 minutes ago",
				},
			]);
		});
	});
});

const publicationTime = (now: Date, publishedAt: Date) => {
    const result = now.getTime() - publishedAt.getTime();
    const minutes = result /60000;

    if (minutes < 1) {
        return "less than a minute ago";
    } else if(minutes === 1 ){
        return "1 minute ago";
    } 
    
    return `${minutes} minutes ago`;
    
}

describe("publicationTime", ()=> {
    test("should return 'less than one minute ago' when the publication date is inferior to one minute", ()=> {
        
        const now = new Date("2024-02-11T16:31:10.000Z");
        const publishedAt = new Date("2024-02-11T16:30:30.000Z");
        const text = publicationTime(now, publishedAt);
        expect(text).toEqual("less than a minute ago");
    });

    test("should return '1 minute ago' when the publication date is under 2 minutes ago", ()=> {
        const now = new Date("2024-02-11T16:31:30.000Z");
        const publishedAt = new Date("2024-02-11T16:30:30.000Z");
        const text = publicationTime(now, publishedAt);
        expect(text).toEqual("1 minute ago");
    });

    test("should return 'X minutes ago when the publication date is more than a minute ago'", ()=> {
        const now = new Date("2024-02-11T16:33:30.000Z");
        const publishedAt = new Date("2024-02-11T16:30:30.000Z");
        const minutes = (now.getTime() - publishedAt.getTime()) / 60000;
        const text = publicationTime(now, publishedAt);
        expect(text).toEqual(`${minutes} minutes ago`);

    })
})

