import bcrypt from 'bcryptjs';
import { AuthenticationError } from 'apollo-server-micro';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { User } from '../../models';
import { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken } from '../../lib/tokens';

const Date = new GraphQLScalarType({
  name: 'Date',
  description: 'Custom date scalar type',
  parseValue: (value) => {
    // value from the client
    return new Date(value);
  },
  serialize: (value) => {
    // value sent to client
    return value.getTime();
  },
  parseLiteral: (ast) => {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value) 
    }

    return null;
  }
})

const Query = {
  hello: () => 'Heyup',
  GET_USERS: () => User.find(),
  GET_REFRESH_TOKEN: (parent, args, { req }) => {
    return req.user || null;
  } 
}

const Mutation = {
  CREATE_USER: async (parent, args, ctx, info) => {
    const { password: plain } = args;
    args.password = await bcrypt.hash(plain, 10);
    return User.create(args);
  },
  LOGIN: async (parent, { email, password }, { res }) => {
    console.log('LOGIN resolver called');
    
    const user = await User.findOne({ email });
    if (!user) throw new AuthenticationError('Invalid Credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new AuthenticationError('Invalid Credentials');

    // login successful, send tokens
    sendAccessToken(res, createAccessToken(user));
    sendRefreshToken(res, createRefreshToken(user));

    console.log('Login', res.getHeader('set-cookie'));
    

    return user;
  },
  
}

export default {
  Date,
  Query,
  Mutation
};
