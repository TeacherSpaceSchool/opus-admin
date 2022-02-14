import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getMainSubcategory = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        mainSubcategory {
                            sc1 { name image _id category {_id} }
                            sc2 { name image _id category {_id} }
                            sc3 { name image _id category {_id} }
                            sc4 { name image _id category {_id} }
                            sc5 { name image _id category {_id} }
                            sc6 { name image _id category {_id} }
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const setMainSubcategory = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ( $sc1: ID, $sc2: ID, $sc3: ID, $sc4: ID, $sc5: ID, $sc6: ID) {
                        setMainSubcategory(sc1: $sc1, sc2: $sc2, sc3: $sc3, sc4: $sc4, sc5: $sc5, sc6: $sc6)
                    }`})
        return res.data.setMainSubcategory
    } catch(err){
        console.error(err)
    }
}