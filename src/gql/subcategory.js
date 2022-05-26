import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getSearchWordsSubcategories = async({ category }, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: { category },
                query: gql`
                    query ($category: ID){
                        searchWordsSubcategories(category: $category)
                    }`
            })
        return res.data.searchWordsSubcategories
    } catch(err){
        console.error(err)
    }
}

export const getSubcategories = async({search, skip, category, sort, compressed}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search, skip, category, sort, compressed},
                query: gql`
                    query ($search: String, $sort: String, $skip: Int, $category: ID, $compressed: Boolean) {
                        subcategories(search: $search, sort: $sort, skip: $skip, category: $category, compressed: $compressed) {
                            _id
                            createdAt
                            name
                            image
                            status
                            del
                            category {_id name}
                            searchWords
                            autoApplication
                            priority
                            quickTitles
                        }
                    }`,
            })
        return res.data.subcategories
    } catch(err){
        console.error(err)
    }
}

export const getSubcategoriesBySpecialist = async(specialist, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {specialist},
                query: gql`
                    query ($specialist: ID!) {
                        subcategoriesBySpecialist(specialist: $specialist) {
                            _id
                            createdAt
                            name
                            image
                            status
                            del
                            category {_id name}
                            searchWords
                            autoApplication
                            priority
                            quickTitles
                        }
                    }`,
            })
        return res.data.subcategoriesBySpecialist
    } catch(err){
        console.error(err)
    }
}

export const getSubcategoriesCount = async({search, category}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search, category},
                query: gql`
                    query ($search: String, $category: ID!) {
                        subcategoriesCount(search: $search, category: $category)
                    }`,
            })
        return res.data.subcategoriesCount
    } catch(err){
        console.error(err)
    }
}

export const getSubcategory = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        subcategory(_id: $_id) {
                            _id
                            createdAt
                            name
                            image
                            status
                            del
                            category {_id name}
                            searchWords
                            autoApplication
                            priority
                            quickTitles
                        }
                    }`,
            })
        return res.data.subcategory
    } catch(err){
        console.error(err)
    }
}

export const deleteSubcategory = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteSubcategory(_id: $_id) 
                    }`})
        return res.data.deleteSubcategory
    } catch(err){
        console.error(err)
    }
}

export const addSubcategory = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($name: String!, $quickTitles: String!, $image: Upload!, $category: ID!, $searchWords: String!, $priority: Int, $autoApplication: Boolean!) {
                        addSubcategory(name: $name, image: $image, quickTitles: $quickTitles, category: $category, searchWords: $searchWords, priority: $priority, autoApplication: $autoApplication) {
                            _id
                            createdAt
                            name
                            image
                            status
                            del
                            category {_id name}
                            searchWords
                            autoApplication
                            quickTitles
                        }
                    }`})
        return res.data.addSubcategory
    } catch(err){
        console.error(err)
    }
}

export const setSubcategory = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $status: String, $quickTitles: String, $name: String, $image: Upload, $searchWords: String, $priority: Int, $autoApplication: Boolean) {
                        setSubcategory(_id: $_id, status: $status, quickTitles: $quickTitles, name: $name, image: $image, searchWords: $searchWords, priority: $priority, autoApplication: $autoApplication) 
                    }`})
        return res.data.setSubcategory
    } catch(err){
        console.error(err)
    }
}