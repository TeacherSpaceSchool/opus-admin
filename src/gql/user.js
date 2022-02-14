import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getUser = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        user(_id: $_id) {
                            _id
                            createdAt
                            updatedAt
                            certificates
                            login
                            role
                            status
                            device
                            notification
                            lastActive
                            name
                            city
                            addresses {address geo apartment}
                            geo
                            email
                            info
                            avatar
                            reiting
                            specializations {category subcategory end discount enable}
                            achievements
                            completedWorks
                            prices {name price}
                            favorites
                            online
                        }
                    }`,
            })
        return res.data.user
    } catch(err){
        console.error(err)
    }
}

export const getUsers = async({favorite, search, employment, category, subcategory, skip, status, limit}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {favorite, search, category, employment, subcategory, skip, status, limit},
                query: gql`
                    query ($favorite: Boolean, $search: String, $employment: Boolean, $category: ID, $subcategory: ID, $skip: Int!, $status: String, $limit: Int) {
                        users(favorite: $favorite, search: $search, employment: $employment, category: $category, subcategory: $subcategory, skip: $skip, status: $status, limit: $limit) {
                            _id
                            createdAt
                            updatedAt
                            certificates
                            login
                            addresses {address geo apartment}
                            role
                            status
                            device
                            notification
                            lastActive
                            name
                            city
                            email
                            info
                            avatar
                            geo
                            reiting
                            specializations {category subcategory end discount enable}
                            completedWorks
                            online
                        }
                    }`,
            })
        return res.data.users
    } catch(err){
        console.error(err)
    }
}

export const getUsersCount = async({favorite, search, employment, category, subcategory, status}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {favorite, search, category, employment, subcategory, status},
                query: gql`
                    query ($favorite: Boolean, $search: String, $employment: Boolean, $category: ID, $subcategory: ID, $status: String) {
                        usersCount(favorite: $favorite, search: $search, employment: $employment, category: $category, subcategory: $subcategory, status: $status) 
                    }`,
            })
        return res.data.usersCount
    } catch(err){
        console.error(err)
    }
}

export const setUser = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $login: String, $certificates: [String], $uploadCertificates: [Upload], $addresses: [AddressInput], $password: String, $status: String, $name: String, $city: String, $email: String, $info: String, $avatar: Upload, $specializations: [SpecializationInput], $achievements: [String], $prices: [PriceInput]) {
                        setUser(_id: $_id, login: $login, certificates: $certificates, uploadCertificates: $uploadCertificates, addresses: $addresses, password: $password, status: $status, name: $name, city: $city, email: $email, info: $info, avatar: $avatar, specializations: $specializations, achievements: $achievements, prices: $prices) 
                    }`})
        return res.data.setUser
    } catch(err){
        console.error(err)
    }
}

export const addEmployment = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($login: String, $password: String, $name: String, $city: String, $role: String, $email: String) {
                        addEmployment(login: $login, password: $password, name: $name, city: $city, role: $role, email: $email) 
                    }`})
        return res.data.addEmployment
    } catch(err){
        console.error(err)
    }
}

export const setDevice = async(device, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {device},
            mutation : gql`
                    mutation ($device: String!) {
                        setDevice(device: $device) 
                    }`})
        return res.data.setDevice
    } catch(err){
        console.error(err)
    }
}

export const readUser = async(field, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {field},
            mutation : gql`
                    mutation ($field: String!) {
                        readUser(field: $field) 
                    }`})
        return res.data.readUser
    } catch(err){
        console.error(err)
    }
}

export const remindPassword = async({email, code, password})=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {email, code, password},
            mutation : gql`
                    mutation ($email: String, $code: String, $password: String) {
                        remindPassword(email: $email, code: $code, password: $password) 
                    }`})
        return res.data.remindPassword
    } catch(err){
        console.error(err)
    }
}

export const checkRemindPassword = async(code, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {code},
            mutation : gql`
                    query ($code: String!) {
                        checkRemindPassword(code: $code) 
                    }`})
        return res.data.checkRemindPassword
    } catch(err){
        console.error(err)
    }
}

export const favoriteUser = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        favoriteUser(_id: $_id) 
                    }`})
        return res.data.favoriteUser
    } catch(err){
        console.error(err)
    }
}

export const onlineUser = async(geo)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {geo},
            mutation : gql`
                    mutation ($geo: [Float]){
                        onlineUser(geo: $geo) 
                    }`})
        return res.data.onlineUser
    } catch(err){
        console.error(err)
    }
}