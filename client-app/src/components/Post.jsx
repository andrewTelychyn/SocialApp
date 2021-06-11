import React, { useState, useEffect, useContext, useCallback } from "react"
import { useHttp } from "../hooks/http.hook"
import { AuthContext } from "../context/AuthContext"
import { useHistory, useLocation } from "react-router-dom"

export const Post = ({
    id,
    userName,
    content,
    userId,
    stringDate,
    likes,
    comments,
    onRemove,
}) => {
    var df = require("dateformat")
    const { request } = useHttp()
    const context = useContext(AuthContext)
    const history = useHistory()
    const path = useLocation().pathname

    const green = "#36B08F"
    const blue = "#55B8F5"
    const red = "#E0245E"
    const bgRed = "#F5E2E8"
    const bgBlue = "#E1EEF7"

    const isMyPost = userId === context.userId

    const [showDeleteButton, setShowDeleteButton] = useState(false)

    const [likeButton, setLikeButton] = useState({
        color: green,
        childClassName: "far fa-heart",
        backgroundColor: null,
    })
    const [commentButton, setCommentButton] = useState({
        color: green,
        childClassName: "far fa-comments",
        backgroundColor: null,
    })

    const [myLike, setMyLike] = useState(false)
    const [myComment, setMyComment] = useState(false)

    const [dateFormat, setDateFormat] = useState("")

    const setDateProperName = useCallback(() => {
        if (!stringDate) return

        const nowDate = new Date(Date.now())
        const date = new Date(stringDate)

        if (date.getFullYear() != nowDate.getFullYear()) {
            setDateFormat(df(date, "mmm d, yyyy"))
            return
        }
        if (date.getMonth() != nowDate.getMonth()) {
            setDateFormat(df(date, "mmm d"))
            return
        }

        const numberThen = date.getDate()
        const numberNow = nowDate.getDate()

        if (numberThen == numberNow) {
            setDateFormat(df(date, "h:MM"))
            return
        }

        if (
            (numberThen < numberNow && numberThen + 7 >= numberNow) ||
            (numberThen > numberNow &&
                numberNow +
                    new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        0
                    ).getDate() <=
                    numberThen + 7)
        ) {
            setDateFormat(df(date, "DDDD, HH:MM"))
            return
        }

        setDateFormat(df(date, "mmm d"))
    }, [stringDate])

    const checkLike = () => {
        if (likes && likes.includes(context.userId)) {
            setLikeButton({
                ...likeButton,
                color: red,
                childClassName: "fas fa-heart",
            })
            setMyLike(true)
        }
    }

    const checkComment = () => {
        if (comments && comments.includes(context.userId)) {
            setCommentButton({
                ...commentButton,
                color: blue,
                childClassName: "fas fa-comments",
            })
            setMyComment(true)
        }
    }

    const onMouseDeleteEvent = (vaue) => {
        if (isMyPost) {
            setShowDeleteButton(vaue)
        }
    }

    const deletePost = async () => {
        try {
            onRemove(id)

            if (path == `/comment/${id}`) {
                history.push("/home")
            }
            const data = await request("/api/post/delete-post", "POST", {
                Id: id,
            })
        } catch (e) {}
    }

    const onMouseEvent = (
        callback,
        color,
        childClassName,
        backgroundColor,
        ifVariable,
        obj
    ) => {
        if (!ifVariable) {
            callback({ color, childClassName, backgroundColor })
        } else {
            callback({ ...obj, backgroundColor })
        }
    }

    const smashThatLikeButton = async () => {
        if (myLike) {
            setLikeButton({
                ...likeButton,
                color: green,
                childClassName: "far fa-heart",
            })

            setMyLike(false)

            const index = likes.indexOf(context.userId)
            if (index > 0) likes.splice(index, 1)

            try {
                await request("/api/post/smash-that-like-button", "POST", {
                    Id: id,
                    UserId: context.userId,
                })
            } catch (e) {}
        } else {
            setLikeButton({
                ...likeButton,
                color: red,
                childClassName: "fas fa-heart",
            })

            setMyLike(true)
            likes.push(context.userId)

            try {
                await request("/api/post/smash-that-like-button", "POST", {
                    Id: id,
                    UserId: context.userId,
                })
            } catch (e) {}
        }
    }

    const wowComment = () => {
        history.push(`/comment/${id}`)
    }

    const goToProfile = () => {
        history.push(`/profile/${userId}`)
    }

    useEffect(() => {
        setDateProperName()
        checkLike()
        checkComment()
    }, [setDateProperName])

    return (
        <div
            className="post-body"
            onMouseEnter={() => onMouseDeleteEvent(true)}
            onMouseLeave={() => onMouseDeleteEvent(false)}
        >
            <div className="post-header">
                <span onClick={goToProfile}>@{userName}</span>
                {showDeleteButton && <p onClick={deletePost}>DELETE</p>}
            </div>
            <div className="post-content">
                <p>{content}</p>
            </div>
            <div className="post-footer">
                <ul>
                    <li id="li-date">{dateFormat}</li>
                    <li
                        id="li-comment"
                        style={{
                            color: commentButton.color,
                            backgroundColor: commentButton.backgroundColor,
                        }}
                        onMouseEnter={() =>
                            onMouseEvent(
                                setCommentButton,
                                blue,
                                "fas fa-comments",
                                bgBlue,
                                myComment,
                                commentButton
                            )
                        }
                        onMouseLeave={() =>
                            onMouseEvent(
                                setCommentButton,
                                green,
                                "far fa-comments",
                                null,
                                myComment,
                                commentButton
                            )
                        }
                        onClick={wowComment}
                    >
                        <i className={commentButton.childClassName}></i>
                        {comments && comments.length > 0
                            ? comments.length
                            : null}
                    </li>
                    <li
                        id="li-like"
                        style={{
                            color: likeButton.color,
                            backgroundColor: likeButton.backgroundColor,
                        }}
                        onMouseEnter={() =>
                            onMouseEvent(
                                setLikeButton,
                                red,
                                "fas fa-heart",
                                bgRed,
                                myLike,
                                likeButton
                            )
                        }
                        onMouseLeave={() =>
                            onMouseEvent(
                                setLikeButton,
                                green,
                                "far fa-heart",
                                null,
                                myLike,
                                likeButton
                            )
                        }
                        onClick={smashThatLikeButton}
                    >
                        <i className={likeButton.childClassName}></i>
                        {likes && likes.length > 0 ? likes.length : null}
                    </li>
                </ul>
            </div>
        </div>
    )
}
