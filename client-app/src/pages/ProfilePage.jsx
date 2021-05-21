import React, { useContext, useState, useEffect, useCallback } from "react"
import { NavLink, useLocation, useParams } from "react-router-dom"
import { Post } from "../components/Post"
import { AuthContext } from "../context/AuthContext"
import { useHttp } from "../hooks/http.hook"

export const ProfilePage = () => {
    const { request } = useHttp()
    let { id } = useParams()

    const grey = "#E1E1E2"
    const green = "#36B08F"
    const white = "#FEFEFE"

    const auth = useContext(AuthContext)
    const path = useLocation().pathname
    const isMyProfile = path == "/profile" || path == `/profile/${auth.userId}`

    const [dataProfile, setDataProfile] = useState({
        userName: "",
        bio: "",
        photo: "",
        following: null,
        followers: null,
        posts: 0,
    })

    const [followStyle, setFollowStyle] = useState({
        backgroundColor: grey,
        color: green,
        content: "FOLLOW",
    })
    const [doFollow, setDoFollow] = useState(false)

    const [posts, setPosts] = useState([])

    const followClickHandler = async () => {
        try {
            const data = await request("/api/user/subscribe", "POST", {
                Id: auth.userId,
                UserId: id,
            })
            if (!data) return

            if (doFollow) {
                setDoFollow(false)
                setFollowStyle({
                    backgroundColor: grey,
                    color: green,
                    content: "FOLLOW",
                })
            } else {
                setDoFollow(true)
                setFollowStyle({
                    backgroundColor: green,
                    color: white,
                    content: "FOLLOWING",
                })
            }
        } catch (e) {}
    }

    const loadPosts = useCallback(async () => {
        const requestId = isMyProfile ? auth.userId : id

        try {
            const data = await request("/api/post/get-user-posts", "POST", {
                UserId: requestId,
            })

            if (data) {
                //console.log(data)
                setPosts(data)
            }
        } catch (e) {}
    }, [auth.userId, request])

    const loadData = useCallback(async () => {
        if (!isMyProfile) {
            try {
                const data = await request("/api/user/getprofile", "POST", {
                    Id: id,
                })

                if (data) {
                    console.log("user data:", data)
                    setDataProfile({
                        ...data,
                        userName: data.name,
                        posts: data.postsIds,
                        followers: data.subscribersUserIds,
                        following: data.subscriptionsUserIds,
                    })
                }
            } catch (e) {}
        } else {
            setDataProfile({
                userName: auth.userName,
                bio: auth.bio,
                photo: auth.photo,
                following: auth.following,
                followers: auth.followers,
                posts: auth.posts,
            })
        }
    }, [isMyProfile, auth, id])

    const deletePost = (id) => {
        const index1 = auth.posts.indexOf(id)
        if (index1 > -1) {
            auth.posts.splice(index1, 1)
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

    const checkFollowing = useCallback(() => {
        if (!isMyProfile && auth.following && auth.following.includes(id)) {
            setDoFollow(true)
            setFollowStyle({
                backgroundColor: green,
                color: white,
                content: "FOLLOWING",
            })
        }
    }, [id])

    useEffect(() => {
        loadData()
        loadPosts()
        checkFollowing()
    }, [loadData, loadPosts, checkFollowing])

    return (
        <div className="container">
            <div className="wrapper-bg">
                <div className="side-bar">
                    {!isMyProfile && (
                        <div className="personal-data">
                            <img
                                className="profile-img"
                                src={auth.photo}
                                alt="profile-photo"
                            />
                            <h2>@{auth.userName}</h2>
                            <p>{auth.bio}</p>
                            <ul>
                                <li className="li-border">
                                    {auth.followers ? auth.followers.length : 0}
                                    <span>
                                        {auth.followers &&
                                        auth.followers.length === 1
                                            ? "FOLLOWER"
                                            : "FOLLOWERS"}
                                    </span>
                                </li>
                                <li className="li-border">
                                    {auth.following ? auth.following.length : 0}
                                    <span>FOLLOWING</span>
                                </li>
                                <li>
                                    {auth.posts ? auth.posts.length : 0}
                                    <span>
                                        {auth.posts && auth.posts.length === 1
                                            ? "POST"
                                            : "POSTS"}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    )}
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
                            <NavLink
                                to="/profile"
                                className={isMyProfile ? "link-active" : ""}
                            >
                                Profile
                            </NavLink>
                            <NavLink to="/trending">Trending</NavLink>
                        </div>
                    </div>
                </div>
                <div className="main-part">
                    <h2>Profile Page</h2>
                    <div className="profile-details">
                        <div className="image-body">
                            <img
                                className="profile-img"
                                src={dataProfile.photo}
                                alt="profile-photo"
                            />
                            {isMyProfile ? (
                                <ul className="ul-profile">
                                    <li>
                                        <NavLink to="/edit-profile">
                                            EDIT PROFILE
                                        </NavLink>
                                    </li>
                                    <li
                                        className="cursor"
                                        onClick={auth.logout}
                                    >
                                        LOGOUT
                                    </li>
                                </ul>
                            ) : (
                                <p
                                    onClick={followClickHandler}
                                    className="follow-button"
                                    style={{
                                        color: followStyle.color,
                                        backgroundColor:
                                            followStyle.backgroundColor,
                                    }}
                                >
                                    {followStyle.content}
                                </p>
                            )}
                        </div>
                        <div className="bio-body">
                            <div className="name-body">
                                <h2>@{dataProfile.userName}</h2>
                                <p>{dataProfile.bio}</p>
                            </div>
                            <ul className="ul-profile">
                                <li>
                                    <span>
                                        {dataProfile.followers
                                            ? dataProfile.followers.length
                                            : 0}
                                    </span>{" "}
                                    FOLLOWERS
                                </li>
                                <li>
                                    <span>
                                        {dataProfile.following
                                            ? dataProfile.following.length
                                            : 0}
                                    </span>{" "}
                                    FOLLOWING
                                </li>
                                <li>
                                    <span>
                                        {dataProfile.posts
                                            ? dataProfile.posts.length
                                            : 0}
                                    </span>{" "}
                                    POSTS
                                </li>
                                <hr />
                                <li>
                                    <span>05.2021</span> REGISTERED
                                </li>
                                <hr />
                            </ul>
                        </div>
                    </div>
                    <div className="posts">
                        <h3>Recent posts</h3>
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
