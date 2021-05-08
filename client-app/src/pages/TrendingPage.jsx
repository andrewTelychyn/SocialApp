import React from 'react'
import {NavLink} from 'react-router-dom'
import {Post} from '../components/Post'

export const TrendingPage = () => {

    let followers = 125
    let posts = 321

    return(
        <div className='container'>
            <div className='wrapper-bg'>
                <div className='side-bar'>
                    <div className='personal-data'>
                        <img className='profile-img'
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"
                        alt="profile-photo"
                        />
                        <h2>Rakhesh B.</h2>
                        <p>Photographer Ctg. Bangladesh</p>

                        <ul>
                            <li className='li-border'>{followers}<span>{followers === 1 ? "FOLLOWER" : "FOLLOWERS"}</span></li>
                            <li className='li-border'>150<span>FOLLOWING</span></li>
                            <li>{posts}<span>{posts === 1 ? "POST" : "POSTS"}</span></li>
                        </ul>
                    </div>
                    <div className='nav-part'>
                        <div className='icons'>
                            <ul>
                                <li><i class="fas fa-file-alt"></i></li>
                                <li><i class="fas fa-user-alt"></i></li>
                                <li><i class="fas fa-fire"></i></li>
                            </ul>
                        </div>
                        <div className='links'>
                            <NavLink to='/home'>Uploads</NavLink>
                            <NavLink to='/profile'>Profile</NavLink>
                            <NavLink to='/trending' className="link-active">Trending</NavLink>
                        </div>
                    </div>
                </div>
                <div className='main-part'>
                    <h2>Trending</h2>
                    <div className='posts'>
                        <Post/>
                    </div>
                </div>
            </div>
        </div>
    )
}
