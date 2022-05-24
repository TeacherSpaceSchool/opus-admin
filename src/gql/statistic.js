import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getStatistic = async({dateStart, dateEnd, type, city}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {dateStart, dateEnd, type, city},
                query: gql`
                    query ($dateStart: Date, $dateEnd: Date, $type: String, $city: String) {
                        statistic(dateStart: $dateStart, dateEnd: $dateEnd, type: $type, city: $city) {
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
