import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getComplaints = async({filter, skip}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {filter, skip},
                query: gql`
                    query ($filter: String, $skip: Int!) {
                        complaints(filter: $filter, skip: $skip) {
                            _id
                            createdAt
                            taken
                            text
                             user {_id name}
                             who {_id name role}
                          }
                    }`,
            })
        return res.data.complaints
    } catch(err){
        console.error(err)
    }
}

export const getComplaintsCount = async({filter}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {filter},
                query: gql`
                    query ($filter: String) {
                        complaintsCount(filter: $filter)
                    }`,
            })
        return res.data.complaintsCount
    } catch(err){
        console.error(err)
    }
}

export const deleteComplaint = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteComplaint(_id: $_id) 
                    }`})
        return res.data.deleteComplaint
    } catch(err){
        console.error(err)
    }
}

export const addComplaint = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($text: String!) {
                        addComplaint(text: $text) {
                            _id
                            createdAt
                            taken
                            text
                             user {_id name}
                        }
                    }`})
        return res.data.addComplaint
    } catch(err){
        console.error(err)
    }
}

export const acceptComplaint = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!) {
                        acceptComplaint(_id: $_id)
                    }`})
        return res.data.acceptComplaint
    } catch(err){
        console.error(err)
    }
}