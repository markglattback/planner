import { GET_REFRESH_TOKEN } from '../apollo/gql';

export default async function refreshTokens({ res, client }) {
    return client.query({
        query: GET_REFRESH_TOKEN
    })
    .then((result) => {
        const { id, firstname } = result.data.GET_REFRESH_TOKEN;
                            
        // if refresh was successful
        if (id && firstname) {
            return {
                authenticated: true,
                user: {
                    id,
                    firstname,
                }  
            }
        }
    })
    .catch(err => {
        console.log(err);
        
        return {
            authenticated: false,
            user: {
                id: '' ,
                firstname: '',
            }  
        }
    })
}