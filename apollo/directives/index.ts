import { SchemaDirectiveVisitor, AuthenticationError } from 'apollo-server-micro';
import { defaultFieldResolver } from 'graphql';

// Auth directive
export class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    // cache field's default resolver
    const { resolve = defaultFieldResolver } = field;
    const { roles } = this.args;

    
    // re-assign resolve function
    field.resolve = async function resolver(...args) {
      const [, , ctx] = args;
      const { req: { user } } = ctx;      
      
      if (!user) throw new AuthenticationError('Directive:  You must be logged in to view this content');

      // if field auth requires a specific role
      if (roles) {
        // TODO: check supplied role against user roles and
        // TODO: throw error if they don't exist
      }

      const data = await resolve.apply(this, args);
      return data;
    };
  }
}

