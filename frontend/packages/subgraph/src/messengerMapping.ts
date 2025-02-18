import { MessageSent, PostSent } from "../generated/Messenger/Messenger";
import { Message, Post } from "../generated/schema";


export function handleMessage(event: MessageSent): void {
    let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    
    let message = new Message(id);
    
    message.sender = event.params.nationId;
    message.receiver = event.params.receiver;
    message.message = event.params.message
    message.createdAt = event.block.timestamp;
    message.transactionHash = event.transaction.hash.toHex();

    message.save();
}

export function handlePost(event: PostSent): void {
    let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    
    let post = new Post(id);
    
    post.sender = event.params.nationId;
    post.post = event.params.post
    post.createdAt = event.block.timestamp;
    post.transactionHash = event.transaction.hash.toHex();

    post.save();
}