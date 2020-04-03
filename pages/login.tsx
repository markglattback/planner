import { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import Router from 'next/router';
import checkAuth from '../lib/checkAuth';

const LOGIN = gql`
    mutation Login($email: String!, $password: String!  ) {
        LOGIN(email: $email, password: $password) {
            id
            firstname
            surname
            email
        }
    }
`;

const Login = ({ authenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { loading, data }] = useMutation(LOGIN, {
        onCompleted: ({ LOGIN: user }) => {
            if (user) Router.push('/');
        }
    });

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            login({
                variables: {
                    email,
                    password
                } 
            })
        }}>
            <input type="email" value={email} onChange={({ target: { value }  }) => setEmail(value)} />
            <input type="password" value={password} onChange={({ target: { value }  }) => setPassword(value)} />
            <button type="submit" disabled={loading}>Login</button>
        </form>
    )  
} 

export async function getServerSideProps(context) {
    return checkAuth(context);
}

export default Login;