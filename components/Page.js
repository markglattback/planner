import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { AppContext } from '../pages/_app';
import Nav from './Nav';

const StyledPage = styled.div`
    padding: 1rem;

`;

const Page = ({ authenticated, user, children }) => { 
    const appState = useContext(AppContext);
    
    useEffect(() => {
        console.log('updating user');
        
        appState.setUser({
            type: 'USER',
            payload: user,
        })
    }, [user]);

    useEffect(() => {
        appState.setAuthenticated(authenticated)
    }, [authenticated]);

    return (
        <StyledPage>
            {authenticated && <Nav authenticated={true} /> }
            {children}
        </StyledPage>
    )
}

export default Page;