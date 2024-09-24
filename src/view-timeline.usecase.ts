import { DateProvider, MessageRepository } from "./post-message.usecase";

export class ViewTimelineUseCase {
    constructor(private readonly messageRepository: MessageRepository,
        private readonly dateProvider: DateProvider
    ) {}

    async handle({ user }: {user: string}): Promise<{author: string, text: string, publicationTime: string}[]> {
       const messagesOfUser = await this.messageRepository.getAllOfUser(user)
        messagesOfUser.sort(
            (msgA,msgB)=> msgB.publishedAt.getTime() - msgA.publishedAt.getTime()
        );

       return messagesOfUser.map((msg) => ({
        author : msg.author,
        text : msg.text,
        publicationTime : this.publicationTime(msg.publishedAt)
       }))
    }

    private publicationTime = (publishedAt: Date) => {
                
        const now = this.dateProvider.getNow()
        const diff = now.getTime() - publishedAt.getTime();
        const minutes = Math.floor(diff /60000);
    
        if (minutes < 1) {
            return "less than a minute ago";
        } else if(minutes === 1 ){
            return "1 minute ago";
        } 
        
        return `${minutes} minutes ago`;
        
    }
}