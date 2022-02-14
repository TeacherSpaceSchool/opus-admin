import { gql } from 'apollo-boost';

export const subscriptionData = gql`
  subscription  {
    reloadData {
        notification 
            {
                _id
                createdAt
                type
                who {login _id name avatar reiting completedWorks}
                whom {login _id name}
                message
                url
                order {_id name status}
                application {_id}
                chat {_id}
                title
            }
        message 
            {
                _id
                createdAt
                who {_id name}
                whom {_id name}
                type
                text
                file
                chat
            }
    }
  }
`