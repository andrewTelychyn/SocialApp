import React, {useContext} from 'react'
import {NavLink} from 'react-router-dom'
import {Post} from '../components/Post'
import {AuthContext} from '../context/AuthContext'

export const TrendingPage = () => {

    const context = useContext(AuthContext)

    let followers = 125
    let posts = 321

    return(
        <div className='container'>
            <div className='wrapper-bg'>
                <div className='side-bar'>
                    <div className='personal-data'>
                        <img className='profile-img'
                        src={context.photo}
                        alt="profile-photo"
                        />
                        <h2>@{context.userName}</h2>
                        <p>{context.bio}</p>

                        <ul>
                            <li className='li-border'>{context.followers}<span>{context.followers === 1 ? "FOLLOWER" : "FOLLOWERS"}</span></li>
                            <li className='li-border'>{context.following}<span>FOLLOWING</span></li>
                            <li>{context.posts}<span>{context.posts === 1 ? "POST" : "POSTS"}</span></li>
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
