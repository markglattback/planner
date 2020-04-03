import { createContext, useState, useReducer } from 'react';
import { ApolloProvider } from '@apollo/client';
import { initApolloClient } from '../apollo/client';
import Page from '../components/Page';
import '../index.css';


export const AppContext = createContext({
    authenticated: '' ,
    setAuthenticated: () => { },
    loading: '' ,
    setLoading: () => { },
    user: {
        id: '',
        firstname: '' 
    } ,
    setUser: () => { },
});    

const MyApp = ({ Component, pageProps }) => {
    // ApolloCLient Initialization     
    const client = initApolloClient({}, undefined);

    // Application State
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useReducer((user, action) => {
        switch (action.type) {
            case 'ID':
                return {
                    ...user,
                    id: action.payload 
                }
            case 'NAME':
                return {
                    ...user,
                    firstname: action.payload 
                }
            case 'USER':
                return {
                    id: action.payload.id,
                    firstname: action.payload.firstname,  
                }
            default:
                return user;
        }
    }, { id: '', firstname: '' });

    // AppContext Initial State
    const initialState = {
        authenticated,
        setAuthenticated,
        loading,
        setLoading,
        user,
        setUser,
    };


    return (
        <AppContext.Provider value={initialState}>
            <ApolloProvider client={client}>
                <Page {...pageProps}>                
                    <Component {...pageProps} />
                </Page>
            </ApolloProvider>
        </AppContext.Provider>
    )
}

export default MyApp;