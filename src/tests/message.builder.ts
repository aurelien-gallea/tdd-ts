import { Message } from "../post-message.usecase";

export const messageBuilder = ({
    id = Math.floor(Math.random() * 10000),
    author = "Author",
    text = "Some text",
    publishedAt = new Date(Date.now())
} : {
    id? : number;
    author?: string;
    text?: string;
    publishedAt?: Date
} = {}) => {
    const props = {id, author, text, publishedAt};

    return {
        withId(_id : number) {
            return messageBuilder({
                ...props,
                id: _id
            });
        },
        authoredBy(_author: string) {
            return messageBuilder({
                ...props,
                author: _author
            })
        },
        withText(_text: string) {
            return messageBuilder({
                ...props,
                text: _text
            })
        },
        build() : Message {
            return {...props}
        }
    }
}