import { Response } from 'express';
import { cookieOptions } from './cookie.options';

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie('access_token', token, cookieOptions);
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie('access_token', cookieOptions);
};