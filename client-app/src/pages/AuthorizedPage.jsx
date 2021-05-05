import React, {useContext} from 'react'
import {AuthContext} from '../context/AuthContext'

export const AuthorizedPage = () => {
    const auth = useContext(AuthContext)

    return(
        <div>
            <h1>Hello again</h1>
            <br/>
            <p onClick={auth.logout}>Logout</p>
        </div>
    )
}