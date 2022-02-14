import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getBlogs = async({user, skip}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {user, skip},
                query: gql`
                    query ($user: ID!, $skip: Int!) {
                        blogs(user: $user, skip: $skip) {
                            _id
                            createdAt
                            image
                            text
                            user {_id name}
                        }
                    }`,
            })
        return res.data.blogs
    } catch(err){
        console.error(err)
    }
}

export const addBlog = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($image: Upload!, $text: String!) {
                        addBlog(image: $image, text: $text) {
                            _id
                            createdAt
                            image
                            text
                            user {_id name}
                        }
                    }`})
        return res.data.addBlog
    } catch(err){
        console.error(err)
    }
}

export const deleteBlog = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteBlog(_id: $_id) 
                    }`})
        return res.data.deleteBlog
    } catch(err){
        console.error(err)
    }
}