import React, { useContext, useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { Post } from "../components/Post"
import { AuthContext } from "../context/AuthContext"
import { useHttp } from "../hooks/http.hook"

export const TrendingPage = () => {
    const context = useContext(AuthContext)
    const { request } = useHttp()

    const [posts, setPosts] = useState([])

    const deletePost = (id) => {
        const index1 = context.posts.indexOf(id)
        if (index1 > -1) {
            context.posts.splice(index1, 1)
        }

        const index2 = posts.indexOf(id)
        if (index2 > -1) {
            setPosts(
                posts
                    .slice(0, index2)
                    .concat(posts.slice(index2 + 1, posts.length))
            )
        }
    }

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await request("/api/post/get-trending-posts")
                if (data) {
                    setPosts(data)
                }
            } catch (e) {}
        }

        loadPosts()
    }, [])

    return (
        <div className="container">
            <div className="wrapper-bg">
                <div className="side-bar">
                    <div className="personal-data">
                        <img
                            className="profile-img"
                            src={context.photo}
                            alt="profile-photo"
                        />
                        <h2>@{context.userName}</h2>
                        <p>{context.bio}</p>

                        <ul>
                            <li className="li-border">
                                {context.followers
                                    ? context.followers.length
                                    : 0}
                                <span>
                                    {context.followers &&
                                    context.followers.length === 1
                                        ? "FOLLOWER"
                                        : "FOLLOWERS"}
                                </span>
                            </li>
                            <li className="li-border">
                                {context.following
                                    ? context.following.length
                                    : 0}
                                <span>FOLLOWING</span>
                            </li>
                            <li>
                                {context.posts ? context.posts.length : 0}
                                <span>
                                    {context.posts && context.posts.length === 1
                                        ? "POST"
                                        : "POSTS"}
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="nav-part">
                        <div className="icons">
                            <ul>
                                <li>
                                    <i class="fas fa-file-alt"></i>
                                </li>
                                <li>
                                    <i class="fas fa-user-alt"></i>
                                </li>
                                <li>
                                    <i class="fas fa-fire"></i>
                                </li>
                            </ul>
                        </div>
                        <div className="links">
                            <NavLink to="/home">Uploads</NavLink>
                            <NavLink to="/profile">Profile</NavLink>
                            <NavLink to="/trending" className="link-active">
                                Trending
                            </NavLink>
                        </div>
                    </div>
                </div>
                <div className="main-part">
                    <h2>Trending</h2>
                    <div className="posts">
                        {posts.map((item, index) => {
                            return (
                                <Post
                                    content={item.content}
                                    id={item.id}
                                    userId={item.userId}
                                    likes={item.likesUserIds}
                                    comments={item.commentsIds}
                                    stringDate={item.date}
                                    userName={item.userName}
                                    onRemove={deletePost}
                                    key={index}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
