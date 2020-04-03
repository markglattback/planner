import cookie from 'cookie';
import { verify } from 'jsonwebtoken';
import { initApolloClient } from '../apollo/client';
import refreshUserTokens from './refreshUserTokens';

export default async function ({ req, res }) {
    let authenticated = false;
    let user = {
        id: '',
        firstname: '',  
    };
    let accessToken;    

    const { headers } = req;
    const requestURL = new URL(req.url, `http://${headers.host}`);
    const { pathname } = requestURL;

    function setProps(newProps) {
        authenticated = newProps.authenticated;
        user = newProps.user;
    }

    // check for access token in cookies
    if (headers.cookie) {
        accessToken = cookie.parse(headers.cookie).accessToken;
    }

    // if there's no access token
    if (!accessToken) {
          if (pathname !== '/login') {            
            res.writeHead(302, { Location: '/login' });
            res.end();
        }
    } else {
        // check that the access token is valid
        try {
            const { id, firstname } = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            setProps({ authenticated: true, user: { id, firstname } });

        } catch(err) {            
            // we know that token is valid but has expired
            if (err.name === 'TokenExpiredError') {
                // try and refresh token, if successful customFetch within
                // apolloClient will attach the cookies to the NextJS response
                const { client } = initApolloClient({}, { req, res });
                
                setProps(await refreshUserTokens({ res, client }));
                
                // redirect if required
                if (authenticated) {
                    if (pathname === '/login') {
                        res.writeHead(302, { Location: '/' });
                        res.end();
                    }                  
                } else if (pathname !== '/login') {
                    res.writeHead(302, { Location: '/login' });
                    res.end();
                }
            }
        }
    }
   
    return {
        props: {
            authenticated,
            user
        } 
    }
}
