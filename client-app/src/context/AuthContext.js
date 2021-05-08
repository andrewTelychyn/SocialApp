import {createContext} from 'react'

const noop = () => {}

export const AuthContext = createContext({
    token: null,
    userId: null,
    login: noop,
    logout: noop,
    isAuthenticated: false,

    userName: null,
    email: null,
    bio: null,
    photo: null,
    followers: 0,
    following: 0,
    posts: 0
})