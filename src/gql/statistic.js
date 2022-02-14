import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getStatistic = async({dateStart, dateType, type, city}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {dateStart, dateType, type, city},
                query: gql`
                    query ($dateStart: Date, $dateType: String, $type: String, $city: String) {
                        statistic(dateStart: $dateStart, dateType: $dateType, type: $type, city: $city) {
                            columns
                            row {_id data}
                        }
                    }`,
            })
        return res.data.statistic
    } catch(err){
        console.error(err)
    }
}
