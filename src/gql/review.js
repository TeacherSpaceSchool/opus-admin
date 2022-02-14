import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getReviews = async({who, whom, skip}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {who, whom, skip},
                query: gql`
                    query ($who: ID, $whom: ID, $skip: Int!) {
                        reviews(who: $who, whom: $whom, skip: $skip) {
                            _id
                            createdAt
                            reiting
                            images
                            info
                            who {_id name avatar}
                            whom {_id name}
                        }
                    }`,
            })
        return res.data.reviews
    } catch(err){
        console.error(err)
    }
}

export const deleteReview = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteReview(_id: $_id) 
                    }`})
        return res.data.deleteReview
    } catch(err){
        console.error(err)
    }
}

export const canReview = async(whom)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {whom},
            mutation : gql`
                    mutation ($whom: ID!) {
                        canReview(whom: $whom) 
                    }`})
        return res.data.canReview
    } catch(err){
        console.error(err)
    }
}

export const addReview = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($reiting: Float!, $uploads: [Upload], $info: String!, $whom: ID!) {
                        addReview(reiting: $reiting, uploads: $uploads, info: $info, whom: $whom) {
                            _id
                            createdAt
                            reiting
                            images
                            info
                            who {_id name}
                            whom {_id name}
                        }
                    }`})
        return res.data.addReview
    } catch(err){
        console.error(err)
    }
}