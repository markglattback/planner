import { useContext } from 'react';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import checkAuth from '../lib/checkAuth';
import { AppContext } from './_app';

const QUERY = gql`
  {
    IS_AUTHENTICATED {
      authenticated
      user {
        id
      }
    }
  }
`;

const HELLO = gql`
  {
    hello 
  }
`

const WelcomeMessage = () => {
  const appState = useContext(AppContext);
  const { user: { firstname }  } = appState;
  
  return (
    <div className="welcome-banner">
      <p className="welcome-message">Hello,</p>
      <p className="welcome-message welcome-message--name">{firstname}</p>
    </div>
  )
  

}

const Index = () => {
  const appState = useContext(AppContext);
    
  return <div>
    <WelcomeMessage />
    <Link href="/about"><a>About</a></Link>

  </div>;
}

export async function getServerSideProps(context) {
  return checkAuth(context);
}

export default Index;