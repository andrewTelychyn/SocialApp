import React, {useContext, useState} from 'react'
import {NavLink, useLocation} from 'react-router-dom'
import {Post} from '../components/Post'
import {AuthContext} from '../context/AuthContext'

export const ProfilePage = () => {

    const grey = "#E1E1E2"
    const green = "#36B08F"
    const white = "#FEFEFE"

    const auth = useContext(AuthContext)
    const isMyProfile = useLocation().pathname == '/profile' 

    const [followStyle, setFollowStyle] = useState({backgroundColor: grey, color: green, content: "FOLLOW"})
    const [doFollow, setDoFollow] = useState(false)
    
    const followClickHandler = () => {
        if(doFollow)
        {   
            setDoFollow(false)
            setFollowStyle({backgroundColor:grey, color: green, content: "FOLLOW"})
        }
        else {
            setDoFollow(true)
            setFollowStyle({backgroundColor:green, color: white, content: "FOLLOWING"})
        }
    }

    return(
        <div className='container'>
            <div className='wrapper-bg'>
                <div className='side-bar'>
                    {!isMyProfile &&
                    <div className='personal-data'>
                        <img className='profile-img'
                        src={auth.photo}
                        alt="profile-photo"
                        />
                        <h2>@{auth.userName}</h2>
                        <p>{auth.bio}</p>
                        <ul>
                            <li className='li-border'>{auth.followers}<span>{auth.followers === 1 ? "FOLLOWER" : "FOLLOWERS"}</span></li>
                            <li className='li-border'>{auth.following}<span>FOLLOWING</span></li>
                            <li>{auth.posts}<span>{auth.posts === 1 ? "POST" : "POSTS"}</span></li>
                        </ul>
                    </div>
                    }
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
                            <NavLink to='/profile' className="link-active">Profile</NavLink>
                            <NavLink to='/trending'>Trending</NavLink>
                        </div>
                    </div>
                </div>
                <div className='main-part'>
                    <h2>Profile Page</h2>
                    <div className='profile-details'>
                        <div className='image-body'>
                            <img className='profile-img'
                            src={auth.photo}
                            alt="profile-photo"
                            />
                            {isMyProfile
                            ?
                            <ul className='ul-profile'>
                                <li><NavLink to="/profile/edit">EDIT PROFILE</NavLink></li>
                                <li className='cursor' onClick={auth.logout}>LOGOUT</li>
                            </ul>
                            :
                            <p 
                            onClick={followClickHandler}
                            className='follow-button'
                            style={{color:followStyle.color, backgroundColor: followStyle.backgroundColor}}
                            >{followStyle.content}</p>
                            }
                        </div>
                        <div className='bio-body'>
                            <div className="name-body">
                                <h2>@{auth.userName}</h2>
                                <p>{auth.bio}</p>
                            </div>
                            <ul className='ul-profile'>
                                <li><span>{auth.followers}</span> FOLLOWERS</li>
                                <li><span>{auth.following}</span> FOLLOWING</li>
                                <li><span>{auth.posts}</span> POSTS</li>
                                <hr/>
                                <li><span>05.2021</span> REGISTERED</li>
                                <hr/>
                                
                            </ul>
                        </div>
                    </div>
                    <div className='posts'>
                        <h3>Recent posts</h3>
                        <Post/>
                    </div>
                </div>
            </div>
        </div>
    )
}
