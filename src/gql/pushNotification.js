import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getPushNotifications = async({search, skip}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search, skip},
                query: gql`
                    query ($search: String!, $skip: Int!){
                        pushNotifications(search: $search, skip: $skip) {
                            _id
                            createdAt
                            title
                            text
                            delivered
                            failed
                            tag
                            url
                            icon
                            click
                        }
                    }`,
            })
        return res.data.pushNotifications
    } catch(err){
        console.error(err)
    }
}

export const getPushNotificationsCount = async({search}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query ($search: String!){
                        pushNotificationsCount(search: $search)
                    }`,
            })
        return res.data.pushNotificationsCount
    } catch(err){
        console.error(err)
    }
}

export const addPushNotification = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($text: String!, $title: String!, $tag: String, $url: String, $icon: Upload) {
                        addPushNotification(text: $text, title: $title, tag: $tag, url: $url, icon: $icon) {
                            _id
                            createdAt
                            title
                            text
                            delivered
                            failed
                            tag
                            url
                            icon
                            click
                        }
                    }`})
        return res.data.addPushNotification
    } catch(err){
        console.error(err)
    }
}