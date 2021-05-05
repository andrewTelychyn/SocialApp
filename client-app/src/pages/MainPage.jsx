import React, {useContext} from 'react'
import {NavLink} from 'react-router-dom'

export const MainPage = () => {


    return(
        <div className='container-2'>
            <div className='wrapper-bg'>
                <div className='side-bar'>
                    <div className='pesonal-data/'>
                        <img 
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"
                        alt="profile-photo"
                        width="100"
                        />
                        <h2>Rakhesh B.</h2>
                        <p>Photographer Ctg. Bangladesh</p>

                        <ul>
                            <li>125<span>FOLLOWERS</span></li>
                            <li>150<span>FOLLOWING</span></li>
                            <li>321<span>POSTS</span></li>
                        </ul>
                    </div>
                    <div className='nav-part'>
                        <NavLink to='/'>Uploads</NavLink>
                        <NavLink to='/'>Profile</NavLink>
                        <NavLink to='/'>Trending</NavLink>
                    </div>
                </div>
                <div className='main-part'>

                </div>
            </div>
        </div>
    )
}
