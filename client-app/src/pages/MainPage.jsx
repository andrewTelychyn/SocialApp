import React, { useEffect, useContext, useState, useCallback } from "react"
import { NavLink } from "react-router-dom"
import { Post } from "../components/Post"
import { AuthContext } from "../context/AuthContext"
import { useHttp } from "../hooks/http.hook"

export const MainPage = () => {
    let { request, loading } = useHttp()
    let context = useContext(AuthContext)

    const [postForm, setPostForm] = useState({
        Content: "",
        UserId: context.userId,
    })
    const [posts, setPosts] = useState([])
    const [classes, setClasses] = useState(["slide-menu", "hide"])

    const onPostChange = (event) => {
        setPostForm({ ...postForm, [event.target.name]: event.target.value })
    }

    const confirmPost = async () => {
        if (postForm.Content.trim() == "") return

        try {
            const data = await request("/api/post/create", "POST", {
                ...postForm,
            })

            setPosts([data, ...posts])
            setPostForm({ ...postForm, Content: "" })
            context.posts.push(data.id)
        } catch (e) {}
    }

    const loadPosts = useCallback(async () => {
        try {
            const data = await request("/api/post/get-uploads-posts", "POST", {
                Id: context.userId,
                SubscriptionsUserIds: context.following,
            })
            if (data) {
                setPosts(data)
                //console.log(data)
            }

            //setTimeout((c) => console.log("hey"), 20000)
        } catch (e) {}
    }, [context.userId, context.following])

    const deletePost = (id) => {
        let index2
        posts.filter((post, index) => {
            if (post.id == id) {
                index2 = index
                return
            }
        })
        if (index2 > -1) {
            setPosts(
                posts
                    .slice(0, index2)
                    .concat(posts.slice(index2 + 1, posts.length))
            )
        }

        const index1 = context.posts.indexOf(id)
        if (index1 > -1) {
            context.posts.splice(index1, 1)
        }
    }

    const slideMenu = (classValue) => {
        setClasses([classes[0], classValue])
    }

    useEffect(() => {
        loadPosts()
    }, [loadPosts])

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
                            <NavLink to="/home" className="link-active">
                                Uploads
                            </NavLink>
                            <NavLink to="/profile">Profile</NavLink>
                            <NavLink to="/trending">Trending</NavLink>
                        </div>
                    </div>
                </div>
                <div className="main-part">
                    <div className={classes.join(" ")}>
                        <div className="slide-menu-links">
                            <NavLink to="/home" className="link-menu-active">
                                Uploads
                            </NavLink>
                            <NavLink to="/profile">Profile</NavLink>
                            <NavLink to="/trending">Trending</NavLink>
                        </div>

                        <i
                            class="fas fa-times"
                            onClick={() => slideMenu("hide")}
                        ></i>
                    </div>
                    <div className="main-head">
                        <h2>Uploads</h2>
                        <div className="side-menu">
                            <i
                                class="fas fa-bars"
                                onClick={() => slideMenu("show")}
                            ></i>
                        </div>
                    </div>
                    <div className="input-post">
                        <span>@{context.userName}</span>
                        <input
                            type="text"
                            value={postForm.Content}
                            Name="Content"
                            onChange={onPostChange}
                            autoComplete="off"
                        />
                        <p onClick={confirmPost}>SUBMIT</p>
                    </div>
                    <div className="posts">
                        <h3>Recent posts</h3>
                        {loading && posts.length === 0 && (
                            <div className="post-loading-container">
                                <div className="loading">
                                    <div className="post-loading"></div>
                                </div>
                            </div>
                        )}
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
