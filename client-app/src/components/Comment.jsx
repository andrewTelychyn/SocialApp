import React, { useEffect, useState, useCallback, useContext } from "react"
import { useHistory } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { useHttp } from "../hooks/http.hook"

export const Comment = ({
    id,
    content,
    userId,
    likes,
    stringDate,
    userName,
    onRemove,
}) => {
    var df = require("dateformat")

    const context = useContext(AuthContext)
    const { request } = useHttp()
    const history = useHistory()

    const green = "#36B08F"
    const red = "#E0245E"
    const bgRed = "#F5E2E8"

    const [likeButton, setLikeButton] = useState({
        color: green,
        childClassName: "far fa-heart",
        backgroundColor: null,
    })

    const [myLike, setMyLike] = useState(false)
    const [dateFormat, setDateFormat] = useState("")

    const [showDeleteButton, setShowDeleteButton] = useState(false)
    const isMyComment = userId === context.userId

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

    const checkLike = useCallback(() => {
        if (likes && likes.includes(context.userId)) {
            setLikeButton({
                ...likeButton,
                color: red,
                childClassName: "fas fa-heart",
            })
            setMyLike(true)
        }
    })

    const deleteComment = async () => {
        try {
            onRemove(id)
            await request("/api/comment/delete-comment", "POST", {
                Id: id,
            })
        } catch (e) {}
    }

    const onMouseDeleteEvent = (vaue) => {
        if (isMyComment) {
            setShowDeleteButton(vaue)
        }
    }

    const setDateProperName = useCallback(() => {
        if (!stringDate) return

        const nowDate = new Date(Date.now())
        const date = new Date(stringDate)

        if (date.getFullYear() !== nowDate.getFullYear()) {
            setDateFormat(df(date, "mmm d, yyyy"))
            return
        }
        if (date.getMonth() !== nowDate.getMonth()) {
            setDateFormat(df(date, "mmm d"))
            return
        }

        const numberThen = date.getDate()
        const numberNow = nowDate.getDate()

        if (numberThen === numberNow) {
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
    }, [stringDate, df])

    const goToProfile = () => {
        history.push(`/profile/${userId}`)
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
                await request("/api/comment/smash-that-like-button", "POST", {
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
                await request("/api/comment/smash-that-like-button", "POST", {
                    Id: id,
                    UserId: context.userId,
                })
            } catch (e) {}
        }
    }

    useEffect(() => {
        setDateProperName()
        checkLike()
    }, [setDateProperName, checkLike])

    return (
        <div
            className="comment-body"
            onMouseEnter={() => onMouseDeleteEvent(true)}
            onMouseLeave={() => onMouseDeleteEvent(false)}
        >
            <div className="comment-header">
                <div className="comment-header-block">
                    <span onClick={goToProfile}>@{userName}</span>
                    <i class="fas fa-circle"></i>
                    <p>{dateFormat}</p>
                </div>
                {showDeleteButton && (
                    <div
                        className="comment-delete-button"
                        onClick={deleteComment}
                    >
                        DELETE
                    </div>
                )}
            </div>
            <div className="comment-main">
                <div className="comment-content">
                    <p>{content}</p>
                </div>
                <div
                    className="like-button"
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
                </div>
            </div>
        </div>
    )
}
