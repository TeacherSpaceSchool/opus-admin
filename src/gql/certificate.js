import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getCertificate = async(user, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {user},
                query: gql`
                    query ($user: ID!) {
                        certificate(user: $user) {
                            _id
                            images 
                        }
                    }`,
            })
        return res.data.certificate
    } catch(err){
        console.error(err)
    }
}

export const setCertificate = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($images: [String], $uploads: [Upload]) {
                        setCertificate(images: $images, uploads: $uploads) 
                    }`})
        return res.data.setCertificate
    } catch(err){
        console.error(err)
    }
}