import cookie from 'cookie';
import { sign } from "jsonwebtoken";

export const createAccessToken = user => {
  return sign(
    { id: user.id, firstname: user.firstname },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5m"
    }
  );
};

export const createRefreshToken = user => {
  return sign(
    { id: user.id, refreshTokenVersion: user.refreshTokenVersion },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d"
    }
  );
};

export const sendAccessToken = function sendAccessToken(res, token) {
  res.setHeader('Set-Cookie', cookie.serialize("accessToken", token, {
    httpOnly: true, 
    sameSite: true,
    maxAge: 30*60*60*24,
    path: '/' 
  }));
};

export const sendRefreshToken = function sendRefreshToken(res, token) {
  const existingCookieString = res.getHeader('Set-Cookie');  
    
  const refreshToken = cookie.serialize("refreshToken", token, {
    httpOnly: true,
    sameSite: true,
    maxAge: 30*60*60*24,
    path: '/' 
  });

  const newCookieString = [existingCookieString, refreshToken];

  res.removeHeader('Set-Cookie');  
  
  res.setHeader('Set-Cookie', newCookieString);
};
