import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getOrder = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        order(_id: $_id) {
                            _id
                            createdAt
                            responsedUsers
                            category {_id name}
                            subcategory {_id name}
                            customer {_id name login}
                            executor {_id name login}
                            chat {_id}
                            name
                            info
                            geo
                            address
                            apartment
                            dateStart
                            dateEnd
                            price
                            urgency
                            images
                            del
                            status
                            views
                            review
                            cancelExecutor
                            cancelCustomer
                            confirm    
                        }
                    }`,
            })
        return res.data.order
    } catch(err){
        console.error(err)
    }
}

export const getNearOrders = async(geo)=>{
    try{
        let client = new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {geo},
                query: gql`
                    query ($geo: [Float]!) {
                        nearOrders(geo: $geo) {
                            _id
                            createdAt
                            responsedUsers
                            subcategory {_id name}
                            name
                            address
                            apartment
                            info
                            geo
                            dateStart
                            dateEnd
                            price
                            urgency
                            images
                            del
                            status
                            views
                            review
                            cancelExecutor
                            cancelCustomer
                            confirm
                        }
                    }`,
            })
        return res.data.nearOrders
    } catch(err){
        console.error(err)
    }
}

export const getOrders = async({skip, my, user, limit, status, subcategory}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {skip, my, user, limit, status, subcategory},
                query: gql`
                    query ($skip: Int!, $my: Boolean, $user: ID, $limit: Int, $status: String, $subcategory: ID) {
                        orders(skip: $skip, my: $my, user: $user, limit: $limit, status: $status, subcategory: $subcategory) {
                            _id
                            createdAt
                            responsedUsers
                            subcategory {_id name}
                            name
                            address
                            apartment
                            info
                            geo
                            dateStart
                            dateEnd
                            price
                            urgency
                            images
                            del
                            status
                            views
                            review
                            cancelExecutor
                            cancelCustomer
                            confirm
                        }
                    }`,
            })
        return res.data.orders
    } catch(err){
        console.error(err)
    }
}

export const getOrdersCount = async(user, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {user},
                query: gql`
                    query($user: ID) {
                        ordersCount(user: $user)
                    }`,
            })
        return res.data.ordersCount
    } catch(err){
        console.error(err)
    }
}

export const addOrder = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($category: ID, $subcategory: ID, $address: String, $apartment: String, $name: String!, $info: String!, $geo: [Float]!, $dateStart: Date, $dateEnd: Date, $price: String, $urgency: Boolean, $uploads: [Upload], $executor: ID) {
                        addOrder(category: $category, subcategory: $subcategory, address: $address, apartment: $apartment, name: $name, info: $info, geo: $geo, dateStart: $dateStart, dateEnd: $dateEnd, price: $price, urgency: $urgency, uploads: $uploads, executor: $executor) 
                    }`})
        return res.data.addOrder
    } catch(err){
        console.error(err)
    }
}

export const setOrder = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $address: String, $apartment: String, $name: String, $info: String, $geo: [Float], $dateStart: Date, $dateEnd: Date, $price: String, $images: [String], $uploads: [Upload], $urgency: Boolean) {
                        setOrder(_id: $_id, address: $address, apartment: $apartment, name: $name, info: $info, geo: $geo, dateStart: $dateStart, dateEnd: $dateEnd, price: $price, images: $images, uploads: $uploads, urgency: $urgency) 
                    }`})
        return res.data.setOrder
    } catch(err){
        console.error(err)
    }
}

export const responseOrder = async({_id, message})=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id, message},
            mutation : gql`
                    mutation ($_id: ID!, $message: String) {
                        responseOrder(_id: $_id, message: $message) 
                    }`})
        return res.data.responseOrder
    } catch(err){
        console.error(err)
    }
}

export const cloneOrder = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        cloneOrder(_id: $_id) 
                    }`})
        return res.data.cloneOrder
    } catch(err){
        console.error(err)
    }
}

export const cancelOrder = async({ _id, message })=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id, message},
            mutation : gql`
                    mutation ($_id: ID!, $message: String) {
                        cancelOrder(_id: $_id, message: $message) 
                    }`})
        return res.data.cancelOrder
    } catch(err){
        console.error(err)
    }
}

export const confirmOrder = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        confirmOrder(_id: $_id) 
                    }`})
        return res.data.confirmOrder
    } catch(err){
        console.error(err)
    }
}

export const approveExecutor = async({_id, executor})=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id, executor},
            mutation : gql`
                    mutation ($_id: ID!, $executor: ID) {
                        approveExecutor(_id: $_id, executor: $executor) 
                    }`})
        return res.data.approveExecutor
    } catch(err){
        console.error(err)
    }
}

export const deleteOrder = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteOrder(_id: $_id) 
                    }`})
        return res.data.deleteOrder
    } catch(err){
        console.error(err)
    }
}