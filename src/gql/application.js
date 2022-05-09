import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getApplication = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        application(_id: $_id) {
                            _id
                            createdAt
                            status
                            documents
                            comments
                            info
                            unread
                            user {_id name}
                            category {_id name}
                            approvedUser {_id name role}
                            subcategory {_id name}
                        }
                    }`,
            })
        return res.data.application
    } catch(err){
        console.error(err)
    }
}

export const getApplications = async({status, search, skip, limit}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {status, search, skip, limit},
                query: gql`
                    query ($status: String, $search: String, $skip: Int!, $limit: Int) {
                        applications(status: $status, search: $search, skip: $skip, limit: $limit) {
                            _id
                            createdAt
                            status
                            documents
                            comments
                            info
                            unread
                            user {_id name}
                            category {_id name}
                            subcategory {_id name}
                            approvedUser {_id name role}
                        }
                    }`,
            })
        return res.data.applications
    } catch(err){
        console.error(err)
    }
}

export const getApplicationsCount = async({search}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query ($search: String) {
                        applicationsCount(search: $search)
                    }`,
            })
        return res.data.applicationsCount
    } catch(err){
        console.error(err)
    }
}

export const addApplication = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($uploads: [Upload], $info: String!, $category: ID!, $subcategory: ID!) {
                        addApplication(info: $info, uploads: $uploads, category: $category, subcategory: $subcategory)
                    }`})
        return res.data.addApplication
    } catch(err){
        console.error(err)
    }
}

export const setApplication = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $approve: Boolean, $documents: [String], $uploads: [Upload], $info: String) {
                        setApplication(_id: $_id, approve: $approve, documents: $documents, uploads: $uploads, info: $info) 
                    }`})
        return res.data.setApplication
    } catch(err){
        console.error(err)
    }
}

export const addCommentForApplication = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $file: Upload, $comment: String!) {
                        addCommentForApplication(_id: $_id, file: $file, comment: $comment) 
                    }`})
        return res.data.addCommentForApplication
    } catch(err){
        console.error(err)
    }
}

export const deleteCommentForApplication = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $idx: Int!) {
                        deleteCommentForApplication(_id: $_id, idx: $idx) 
                    }`})
        return res.data.deleteCommentForApplication
    } catch(err){
        console.error(err)
    }
}

export const deleteApplication = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteApplication(_id: $_id) 
                    }`})
        return res.data.deleteApplication
    } catch(err){
        console.error(err)
    }
}