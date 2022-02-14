import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getContact = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        contact {
                            name
                            image
                            addresses {address geo}
                            email
                            phone
                            info
                            social
                            _id
                          }
                    }`,
            })
        return res.data.contact
    } catch(err){
        console.error(err)
    }
}

export const setContact = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ( $name: String!, $image: Upload, $addresses: [AddressInput]!, $email: [String]!, $phone: [String]!, $info: String!, $social: [String]!) {
                        setContact(name: $name, image: $image, addresses: $addresses, email: $email, phone: $phone, info: $info, social: $social)
                    }`})
    } catch(err){
        console.error(err)
    }
}