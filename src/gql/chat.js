import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getChat = async(_id, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        chat(_id: $_id) {
                            updatedAt
                            part1 {_id name avatar login}
                            part2 {_id name avatar login}
                            part1Unread
                            part2Unread
                            lastMessage {type text}
                        }
                    }`,
            })
        return res.data.chat
    } catch(err){
        console.error(err)
    }
}

export const getChats = async({search, user, skip, limit}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {user, search, skip, limit},
                query: gql`
                    query ($search: String, $user: ID, $skip: Int!, $limit: Int) {
                        chats(search: $search, user: $user, skip: $skip, limit: $limit) {
                            _id
                            updatedAt
                            part1 {_id name avatar}
                            part2 {_id name avatar}
                            part1Unread
                            part2Unread
                            lastMessage {type text}
                        }
                    }`,
            })
        return res.data.chats
    } catch(err){
        console.error(err)
    }
}

export const getMessages = async({chat, skip}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {chat, skip},
                query: gql`
                    query ($chat: ID!, $skip: Int!) {
                        messages(chat: $chat, skip: $skip) {
                            _id
                            createdAt
                            who {_id name}
                            whom {_id name}
                            type
                            text
                            file
                        }
                    }`,
            })
        return res.data.messages
    } catch(err){
        console.error(err)
    }
}

export const sendMessage = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($type: String!, $text: String, $file: Upload, $chat: ID!) {
                        sendMessage(type: $type, text: $text, file: $file, chat: $chat) {
                            _id
                            createdAt
                            who {_id name}
                            whom {_id name}
                            type
                            text
                            file
                        }
                    }`})
        return res.data.sendMessage
    } catch(err){
        console.error(err)
    }
}

export const readChat = async(chat)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {chat},
            mutation : gql`
                    mutation ($chat: ID!) {
                        readChat(chat: $chat) 
                    }`})
        return res.data.readChat
    } catch(err){
        console.error(err)
    }
}
