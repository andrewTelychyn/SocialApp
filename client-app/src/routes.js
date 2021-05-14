import React from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import {LoginPage} from './pages/LoginPage.jsx'
import {RegisterPage} from './pages/RegisterPage.jsx'
import {MainPage} from './pages/MainPage.jsx'
import {ProfilePage} from './pages/ProfilePage'
import {EditProfilePage} from './pages/EditProfilePage'
import {TrendingPage} from './pages/TrendingPage'
import {CommentPage} from './pages/CommentPage'

export const useRoute = (isAuthenticated) => {
    if(isAuthenticated)
    {
        return(
            <Switch>
                <Route path="/home">
                    <MainPage/>
                </Route>
                <Route path="/profile" exact>
                    <ProfilePage/>
                </Route>
                <Route path="/profile/edit" exact>
                    <EditProfilePage/>
                </Route>
                <Route path="/trending" exact>
                    <TrendingPage/>
                </Route>
                <Route path="comment/:id">
                    <CommentPage/>
                </Route>
                <Route path="profile/:id">
                    <ProfilePage/>
                </Route>
                <Redirect to="/home"/>
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