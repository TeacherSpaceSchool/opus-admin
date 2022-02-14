import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getBonus = async({user}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {user},
                query: gql`
                    query ($user: ID) {
                        bonus(user: $user) {
                            _id
                            createdAt
                            count
                            user {_id name}
                            code
                        }
                    }`,
            })
        return res.data.bonus
    } catch(err){
        console.error(err)
    }
}

export const getBonusHistory = async({user, skip}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {user, skip},
                query: gql`
                    query ($user: ID, $skip: Int!) {
                        bonusHistory(user: $user, skip: $skip) {
                            _id
                            createdAt
                            count
                            what
                            user {_id name}
                            invited {_id name}
                        }
                    }`,
            })
        return res.data.bonusHistory
    } catch(err){
        console.error(err)
    }
}

export const addBonus = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($count: Int!, $user: ID!) {
                        addBonus(count: $count, user: $user) {
                            _id
                            createdAt
                            count
                            what
                            user {_id name}
                            invited {_id name}
                        }
                    }`})
        return res.data.addBonus
    } catch(err){
        console.error(err)
    }
}
