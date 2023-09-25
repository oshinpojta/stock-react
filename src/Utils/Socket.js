import { io } from 'socket.io-client';
import { getCookie } from './HandleCookie';

// https://socket.io/how-to/use-with-react
// https://socket.io/docs/v4/handling-cors
// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';
const userStr = getCookie("user");
const userObj = JSON.parse(userStr);

export const socket = io(URL,{
    auth : userObj,
    autoConnect: false
});