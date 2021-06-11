import React, { useContext, useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import { Post } from "../components/Post"
import { Comment } from "../components/Comment"
import { AuthContext } from "../context/AuthContext"
import { useHttp } from "../hooks/http.hook"

export const CommentPage = () => {
    const context = useContext(AuthContext)
    const { request, loading } = useHttp()
    let { id } = useParams()

    const [post, setPost] = useState({})
    const [comments, setComments] = useState([])

    const [commentForm, setCommentForm] = useState({
        Content: "",
        UserId: context.userId,
        PostId: id,
    })

    const onCommentChange = (event) => {
        setCommentForm({
            ...commentForm,
            [event.target.name]: event.target.value,
        })
    }
    const [classes, setClasses] = useState(["slide-menu", "hide"])

    const slideMenu = (classValue) => {
        setClasses([classes[0], classValue])
    }

    const deleteComment = (id) => {
        let index1
        comments.filter((comment, index) => {
            if (comment.id == id) {
                index1 = index
                return
            }
        })
        if (index1 > -1) {
            setComments(
                comments
                    .slice(0, index1)
                    .concat(comments.slice(index1 + 1, comments.length))
            )
        }
        let index = post.commentsIds.indexOf(id)
        if (index > -1)
            setPost({ ...post, commentsIds: post.commentsIds.splice(index, 1) })
    }

    const deletePost = async (theid) => {
        const index1 = context.posts.indexOf(theid)
        if (index1 > -1) {
            context.posts.splice(index1, 1)
        }
    }

    const confirmComment = async () => {
        if (commentForm.Content.trim() === "") return

        try {
            const data = await request("/api/comment/add-comment", "POST", {
                ...commentForm,
            })

            setComments([...comments, data])
            setCommentForm({ ...commentForm, Content: "" })
            setPost({ ...post, commentsIds: [...post.commentsIds, data.id] })
        } catch (e) {}
    }

    useEffect(() => {
        const getPost = async () => {
            try {
                const data = await request("/api/post/get-one-post", "POST", {
                    Id: id,
                })
                if (data) {
                    setPost(data)
                }
            } catch (e) {}
        }
        const getComments = async () => {
            try {
                const data = await request(
                    "/api/comment/get-comments",
                    "POST",
                    {
                        Id: id,
                    }
                )
                if (data) {
                    setComments(data)
                }
            } catch (e) {}
        }
        getPost()
        getComments()
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
                            <NavLink to="/trending">Trending</NavLink>
                        </div>
                    </div>
                </div>
                <div className="main-part">
                    <div className={classes.join(" ")}>
                        <div className="slide-menu-links">
                            <NavLink to="/home">Uploads</NavLink>
                            <NavLink to="/profile">Profile</NavLink>
                            <NavLink to="/trending">Trending</NavLink>
                        </div>

                        <i
                            class="fas fa-times"
                            onClick={() => slideMenu("hide")}
                        ></i>
                    </div>
                    <div className="main-head">
                        <h2>Profile Page</h2>
                        <div className="side-menu">
                            <i
                                class="fas fa-bars"
                                onClick={() => slideMenu("show")}
                            ></i>
                        </div>
                    </div>
                    <Post
                        content={post.content}
                        id={post.id}
                        userId={post.userId}
                        likes={post.likesUserIds}
                        comments={post.commentsIds}
                        stringDate={post.date}
                        userName={post.userName}
                        onRemove={deletePost}
                    />
                    <div className="comments">
                        {comments.map((item, index) => {
                            return (
                                <Comment
                                    content={item.content}
                                    id={item.id}
                                    userId={item.userId}
                                    likes={item.likesUserIds}
                                    stringDate={item.date}
                                    userName={item.userName}
                                    key={index}
                                    onRemove={deleteComment}
                                />
                            )
                        })}
                        {loading && (
                            <div class="comment-loading-container">
                                <div className="loading">
                                    <div className="comment-loading"></div>
                                </div>
                            </div>
                        )}
                        <div className="comment-input">
                            <input
                                type="text"
                                value={commentForm.Content}
                                Name="Content"
                                onChange={onCommentChange}
                                autoComplete="off"
                            />
                            <p onClick={confirmComment}>SUBMIT</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
