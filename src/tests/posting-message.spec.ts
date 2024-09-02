import { log } from "console";
import { DateProvider, EmptyMessageError, Message, MessageRepository, MessageTooLongError, PostMessageCommand, PostMessageUseCase } from "../post-message.usecase"
import { InMemoryMessageRepository } from "../message.inmemory.repository";

describe("feature: Posting a message", () => {
    let fixture : Fixture;

    beforeEach(() => {
        fixture = createFixture();
    })

    describe("Rule: A message can contain a maximum of 280 caracters", ()=> {
        test("Alice can post a message on het timeline",async  () => {
            
           fixture.givenNowIs(new Date("2024-08-30T19:00:00.000Z"))

           await fixture.whenUserPostsAMessage({
                id: 0,
                text: "hello",
                author : "Alice"
            })

            fixture.thenPostMessageShouldBe({
                id: 0,
                text: "hello",
                author: "Alice",
                publishedAt: new Date("2024-08-30T19:00:00.000Z")
            })
        });
        test("Alice cannot post a message with more than 280 caracters", async () => {
            const textWithLenthOf281 = 
      "Fortes fortuna adiuvat, sed sapientia sola est quae hominem vere felicem facit. Amicitia vera, in qua non est simulatio, sed pura sinceritas, rarissima est et, cum reperitur, maioris est pretii quam omnia divitiae et honores mundi huius transitorii. In rebus adversis virtus maxime elucet."
            fixture.givenNowIs(new Date("2024-08-30T19:00:00.000Z"))
            
           await fixture.whenUserPostsAMessage({
                id: 0,
                author : "Alice",
                text: textWithLenthOf281
            });

            fixture.thenErrorShouldBe(MessageTooLongError);
        });
        
    });

    describe("Role: A msg cannot be empty", ()=> {
        test("Alice cannot post an empty msg", async () => {
            fixture.givenNowIs(new Date("2024-08-30T19:00:00.000Z"))

           await fixture.whenUserPostsAMessage({
                id: 0,
                text: "",
                author : "Alice"
            });

            fixture.thenErrorShouldBe(EmptyMessageError)
        });

        test("Alice cannot post a message with only whitespaces", async () => {
            fixture.givenNowIs(new Date("2024-08-30T19:00:00.000Z"));

           await fixture.whenUserPostsAMessage({
                id: 0,
                author : "Alice",
                text: "            "
            })

            fixture.thenErrorShouldBe(EmptyMessageError)
        })
    })
})






class StubDateProvider implements DateProvider {
    now: Date
    getNow(): Date {
       return this.now; 
    }
}





const createFixture = () => {
    
    const dateProvider = new StubDateProvider();
    const messageRepository = new InMemoryMessageRepository();
    const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider);
    let thrownError : Error;

    return {
        givenNowIs(now: Date){
            dateProvider.now = now;
        },
       async whenUserPostsAMessage(postMessageCommand : PostMessageCommand) {
            try {
               await postMessageUseCase.handle(postMessageCommand);
                
            } catch (error) {
                thrownError = error;
            }
        },
        thenPostMessageShouldBe(expectedMessage :Message) {
            expect(expectedMessage).toEqual(messageRepository.message)
        },
        thenErrorShouldBe(expectedErrorClass : new ()=> Error) {
            expect(thrownError).toBeInstanceOf(expectedErrorClass);
        }

    }
}

type Fixture = ReturnType<typeof createFixture>;