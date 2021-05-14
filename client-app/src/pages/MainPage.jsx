import React, {useEffect, useContext, useState} from 'react'
import {NavLink} from 'react-router-dom'
import {Post} from '../components/Post'
import {AuthContext} from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
const path = require('path')

export const MainPage = () => {

    //src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"
    
    let {request} = useHttp()
    let context = useContext(AuthContext)

    const [loaded, setLoaded] = useState(false)
    const [postForm, setPostForm] = useState({Content: '', UserId: context.userId})
    const [posts, setPosts] = useState([])

    const onPostChange = (event) => {
        setPostForm({...postForm, [event.target.name]: event.target.value})
    }

    const confirmPost = async () => {
        try {
            var date = new Date(Date.now())
            const data = await request('/api/post/create', 'POST', {...postForm, Date: date})
            setPosts([data, ...posts])
            setPostForm({...postForm, Content:''})
        } catch (e) {
            
        }
    }

    useEffect(() => {
        const getdata = async () => {
            try {
                const data = await request('api/user/getprofile', 'POST', {Id:context.userId})
                
                if(data) {
                    context.bio = data.bio
                    context.email = data.email
                    context.userName = data.userName
                    
                    context.posts = data.posts
                    context.followers = data.followers
                    context.following = data.following

                    if(!(!!context.photo))
                        context.photo = data.photo
                    
                    setLoaded(true)
                }
            } catch (e) {
                console.log(e.message)
            }
        }
        const loadPosts = async () => {
            try {
                const data = await request('/api/post/get-user-posts', 'POST', {Id: context.userId})
                
                if(data) {
                    console.log(data)
                    setPosts(data)
                }
            } catch (e) {}
        }
        loadPosts()
        getdata()
    }, [])

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
                            <NavLink to='/home' className="link-active">Uploads</NavLink>
                            <NavLink to='/profile'>Profile</NavLink>
                            <NavLink to='/trending'>Trending</NavLink>
                        </div>
                    </div>
                </div>
                <div className='main-part'>
                    <h2>Uploads</h2>
                    <div className='input-post'>
                        <span>@{context.userName}</span>
                        <input type="text" value={postForm.Content} Name='Content' onChange={onPostChange}/>
                        <p onClick={confirmPost}>SUBMIT</p>
                    </div>
                    <div className='posts'>
                        <h3>Recent posts</h3>
                        {posts.map((item, index) => {
                            return <Post 
                            content={item.content} 
                            id={item.id} 
                            userId={item.userId} 
                            likes={item.likesUserIds} 
                            comments={item.commentsIds} 
                            stringDate={item.date}
                            userName={item.userName} 
                            key={index}/>
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
