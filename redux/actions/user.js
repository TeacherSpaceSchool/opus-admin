import {
    UNAUTHENTICATED,
    SET_PROFILE,
    SET_AUTH,
    ERROR_AUTHENTICATED,
    CLEAR_ERROR_AUTHENTICATED
} from '../constants/user'
import {
    SHOW_LOAD
} from '../constants/app'
import Cookies from 'js-cookie';
import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../../src/singleton/client';
import { unregister, register } from '../../src/subscribe';
import Router from 'next/router';

export function signin(payload) {
    return async (dispatch) => {
        await dispatch({
            type: SHOW_LOAD,
            payload: true
        })
        try {
            const client = new SingletonApolloClient().getClient();
            let result = await client.mutate({
                variables: payload,
                mutation : gql`
                    mutation ($name: String, $login: String!, $password: String!, $code: String, $isApple: Boolean) {
                        signinuser(name: $name, login: $login, password: $password, code: $code, isApple: $isApple) {
                            role
                            status
                            login
                            city
                            addresses {address geo apartment}
                            _id
                            specializations {category subcategory end discount enable}
                            name
                            phone
                            unreadBN {notifications0 notifications1}
                            verification
                        }
                    }`})
            if(result.data.signinuser.role==='Проверьте данные') {
                await dispatch({
                    type: ERROR_AUTHENTICATED,
                    payload: true
                })
                await dispatch({
                    type: SHOW_LOAD,
                    payload: false
                })
            }
            else {
                /*await dispatch({
                    type: SHOW_MINI_DIALOG,
                    payload: false
                })*/
                let reloadTimeout = setTimeout(()=>window.location.reload(), 30000)
                await register(true)
                clearInterval(reloadTimeout)
                window.location.reload()
            }
        } catch(error) {
            await dispatch({
                type: SHOW_LOAD,
                payload: false
            })
            await dispatch({
                type: ERROR_AUTHENTICATED,
                payload: true
            })
        }
    };
}

export function setAuthenticated(auth) {
    return {
        type: SET_AUTH,
        payload: auth
    }
}

export function clearErrorAuthenticated() {
    return {
        type: CLEAR_ERROR_AUTHENTICATED,
    }
}

export function logout(reload) {
    return async (dispatch) => {
        await dispatch({
            type: SHOW_LOAD,
            payload: true
        })
        await dispatch({
            type: UNAUTHENTICATED,
        })
        await Cookies.remove('jwt');
        await dispatch({
            type: SET_PROFILE,
            payload: {}
        })
        if(reload) {
            await unregister()
            await Router.push('/')
            window.location.reload()
        }
        else
            await dispatch({
                type: SHOW_LOAD,
                payload: false
            })
    }
}

export function setProfile() {
    return async (dispatch) => {
        try {
            const client = new SingletonApolloClient().getClient()
            let result = await client
                .query({
                    query: gql`
                    query {
                        getStatus {
                            role
                            status
                            login
                            city
                            addresses {address geo apartment}
                            _id
                            specializations {category subcategory end discount enable}
                            name
                            phone
                            unreadBN {notifications0 notifications1}
                            verification
                        }
                    }`
                })

            await dispatch({
                type: SET_PROFILE,
                payload: result.data.getStatus
            })
        } catch(error) {
            console.error(error)
        }
    };
}

export async function getProfile(client) {
    try {
        client = client? client : new SingletonApolloClient().getClient()
        let result = await client
            .query({
                query: gql`
                   query {
                       getStatus {
                            role
                            status
                            login
                            city
                            addresses {address geo apartment}
                            _id
                            specializations {category subcategory end discount enable}
                            phone
                            name
                            unreadBN {notifications0 notifications1}
                            verification
                       }
                   }`
            })
        return result.data.getStatus
    } catch(error) {
        console.error(error)
    }
}