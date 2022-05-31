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
                            verification
                        }
                    }`,
            })
        return res.data.user
    } catch(err){
        console.error(err)
    }
}

export const getUsers = async({favorite, search, employment, dateStart, dateEnd, subcategory, category, skip, status, limit}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {favorite, search, dateStart, dateEnd, subcategory, category, employment, skip, status, limit},
                query: gql`
                    query ($dateStart: Date, $dateEnd: Date, $subcategory: ID, $favorite: Boolean, $search: String, $employment: Boolean, $category: ID, $skip: Int!, $status: String, $limit: Int) {
                        users(dateStart: $dateStart, dateEnd: $dateEnd, subcategory: $subcategory, favorite: $favorite, search: $search, employment: $employment, category: $category, skip: $skip, status: $status, limit: $limit) {
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
                            verification
                        }
                    }`,
            })
        return res.data.users
    } catch(err){
        console.error(err)
    }
}

export const getUsersCount = async({favorite, search, employment, dateStart, dateEnd, subcategory, category, status}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {favorite, search, dateStart, dateEnd, subcategory, category, employment, status},
                query: gql`
                    query ($dateStart: Date, $dateEnd: Date, $subcategory: ID, $favorite: Boolean, $search: String, $employment: Boolean, $category: ID, $status: String) {
                        usersCount(dateStart: $dateStart, dateEnd: $dateEnd, subcategory: $subcategory, favorite: $favorite, search: $search, employment: $employment, category: $category, status: $status) 
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
                    mutation ($_id: ID!, $login: String, $certificates: [String], $verification: Boolean, $uploadCertificates: [Upload], $addresses: [AddressInput], $password: String, $status: String, $name: String, $city: String, $email: String, $info: String, $avatar: Upload, $specializations: [SpecializationInput], $achievements: [String], $prices: [PriceInput]) {
                        setUser(_id: $_id, login: $login, certificates: $certificates, verification: $verification, uploadCertificates: $uploadCertificates, addresses: $addresses, password: $password, status: $status, name: $name, city: $city, email: $email, info: $info, avatar: $avatar, specializations: $specializations, achievements: $achievements, prices: $prices) 
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