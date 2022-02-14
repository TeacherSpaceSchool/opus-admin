import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getNotifications = async({user, skip, order, application, limit}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {user, skip, order, application, limit},
                query: gql`
                    query ($user: ID, $skip: Int!, $order: ID, $application: ID, $limit: Int) {
                        notifications(user: $user, skip: $skip, order: $order, application: $application, limit: $limit) {
                            _id
                            createdAt
                            type
                            who {login _id name avatar reiting completedWorks}
                            whom {login _id name}
                            message
                            url
                            order {_id name status review}
                            application {_id}
                            chat {_id}
                            title
                        }
                    }`,
            })
        return res.data.notifications
    } catch(err){
        console.error(err)
    }
}