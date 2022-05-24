import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getUserByPhone = async(phone, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .mutate({
                variables: {phone},
                mutation: gql`
                    mutation ($phone: String!) {
                        getUserByPhone(phone: $phone) 
                    }`,
            })
        return res.data.getUserByPhone
    } catch(err){
        console.error(err)
    }
}

export const changePhone = async({newPhone, password}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .mutate({
                variables: {newPhone, password},
                mutation: gql`
                    mutation ($newPhone: String!, $password: String) {
                        changePhone(newPhone: $newPhone, password: $password) 
                    }`,
            })
        return res.data.changePhone
    } catch(err){
        console.error(err)
    }
}