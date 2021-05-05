import React from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import {LoginPage} from './pages/LoginPage.jsx'
import {RegisterPage} from './pages/RegisterPage.jsx'
import {MainPage} from './pages/MainPage.jsx'

export const useRoute = (isAuthenticated) => {
    if(isAuthenticated)
    {
        return(
            <Switch>
                <Route path="/main">
                    <MainPage/>
                    {/* <AuthorizedPage/> */}
                    {/* <h1>Hello</h1> */}
                </Route>
                <Redirect to="/main"/>
            </Switch>
        )
    }
    else
    {
        return(
            <Switch>
                <Route path="/register">
                    <RegisterPage/>
                </Route>
                <Route path="/login">
                    <LoginPage/>
                </Route>
                <Redirect to="/login"/>
            </Switch>
        )
    }

}