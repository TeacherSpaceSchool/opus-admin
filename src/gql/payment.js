import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getPayments = async({search, paymentSystem, skip, date}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search, paymentSystem, skip, date},
                query: gql`
                    query ($search: String, $paymentSystem: String, $date: String, $skip: Int!) {
                        payments(search: $search, paymentSystem: $paymentSystem, skip: $skip, date: $date) {
                            _id
                            createdAt
                            number
                            user
                            service
                            status
                            paymentSystem
                            amount
                            refund
                        }
                    }`,
            })
        return res.data.payments
    } catch(err){
        console.error(err)
    }
}

export const refundPayment = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        refundPayment(_id: $_id) 
                    }`})
        return res.data.refundPayment
    } catch(err){
        console.error(err)
    }
}