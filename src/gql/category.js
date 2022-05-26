import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getSearchWordsCategories = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        searchWordsCategories
                    }`
            })
        return res.data.searchWordsCategories
    } catch(err){
        console.error(err)
    }
}

export const getCategories = async({search, skip, compressed}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search, skip, compressed},
                query: gql`
                    query ($search: String, $skip: Int, $compressed: Boolean) {
                        categories(search: $search, skip: $skip, compressed: $compressed) {
                            _id
                            createdAt
                            name
                            image
                            status
                            del
                            priority
                            searchWords
                        }
                    }`,
            })
        return res.data.categories
    } catch(err){
        console.error(err)
    }
}

export const getCategory = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        category(_id: $_id) {
                            _id
                            createdAt
                            name
                            image
                            status
                            del
                            priority
                            searchWords
                        }
                    }`,
            })
        return res.data.category
    } catch(err){
        console.error(err)
    }
}

export const getCategoriesCount = async({search}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query ($search: String) {
                        categoriesCount(search: $search) 
                    }`,
            })
        return res.data.categoriesCount
    } catch(err){
        console.error(err)
    }
}

export const deleteCategory = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteCategory(_id: $_id) 
                    }`})
        return res.data.deleteCategory
    } catch(err){
        console.error(err)
    }
}

export const addCategory = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($name: String!, $image: Upload!, $searchWords: String!, $priority: Int) {
                        addCategory(name: $name, image: $image, searchWords: $searchWords, priority: $priority) {
                            _id
                            createdAt
                            name
                            image
                            status
                            del
                            priority
                            searchWords
                        }
                    }`})
        return res.data.addCategory
    } catch(err){
        console.error(err)
    }
}

export const setCategory = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $status: String, $name: String, $image: Upload, $searchWords: String, $priority: Int) {
                        setCategory(_id: $_id, status: $status, name: $name, image: $image, searchWords: $searchWords, priority: $priority) 
                    }`})
        return res.data.setCategory
    } catch(err){
        console.error(err)
    }
}