export class ViewTimelineUseCase {
    async handle({ user }: {user: string}): Promise<{author: string, text: string, publicationTime: string}[]> {
        return [
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
        ]
    }
}