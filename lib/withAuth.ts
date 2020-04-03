import { decode, verify } from 'jsonwebtoken';
import { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken } from './tokens';
import { User } from "../models";

function addUserToRequest (req, user) {
  req.user = user;
}

const withAuth = handler => async (req, res) => {   
  const { cookies = {} } = req;
  const { accessToken = '', refreshToken = '' } = cookies;
  
  console.log('getting this far');
  
  if (cookies && accessToken) {
    try {
      const user = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      addUserToRequest(req, user); 
      console.log('getting this far 2');
      
    } catch(err) {
      // if access token has expired
      console.log('getting this far 3');
      if (err.name === 'TokenExpiredError') {
        console.log('getting this far 4');
        try {
          const { id, refreshTokenVersion } = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
          const user = await User.findById(id);
          console.log('getting this far after user');
          
          if (user && user.refreshTokenVersion === refreshTokenVersion) {
            addUserToRequest(req, user);
            
            // issue new access tokens and send as cookies
            sendAccessToken(res, createAccessToken(user));
            sendRefreshToken(res, createRefreshToken(user)); 
          } else {
            console.log('user invalid');
            console.log('getting this far 5');
            
            res.removeHeader('Set-cookie')
          }
        } catch(err) {
          console.log('getting this far 6');
          console.log('refresh token invalid');
          
          // if there are any errors when verifying refresh token
          // remove cookies from response (will force user to login)
          res.removeHeader('Set-cookie');
        } 
      }
    }
  }
  
  return handler(req, res);
}

export default withAuth;
