import React, {useState , useEffect, useContext, useCallback} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'

export const Post = ({id, userName, content, userId, stringDate, likes, comments}) => {
    var df = require('dateformat')

    const {request} = useHttp()
    const context = useContext(AuthContext)
    //

    //const likes = 12
    //const comments = 2


    const green = "#36B08F"
    const blue = "#55B8F5"
    const red = "#E0245E"
    const bgRed = "#F5E2E8"
    const bgBlue = "#E1EEF7" 


    const [likeButton, setLikeButton] = useState({color: green, childClassName: "far fa-heart", backgroundColor: null}) 
    const [commentButton, setCommentButton] = useState({color: green, childClassName: "far fa-comments", backgroundColor: null})
    
    const [myLike, setMyLike] = useState(false)
    const [myComment, setMyComment] = useState(false)

    const [dateFormat, setDateFormat] = useState('')

    const setDateProperName = () => {

        const nowDate = new Date(Date.now())
        const date = new Date(stringDate)

        if(date.getFullYear() != nowDate.getFullYear())
        {
            setDateFormat(df(date, "mmm d, yyyy"))
            return
        }
        if(date.getMonth() != nowDate.getMonth())
        {
            setDateFormat(df(date, "mmm d"))
            return
        }

        const numberThen = date.getDate()
        const numberNow = nowDate.getDate()

        if(numberThen == numberNow)
        {
            setDateFormat(df(date, "h:MM"))
            return
        }

        if((numberThen < numberNow && numberThen + 7 >= numberNow) || (numberThen > numberNow && numberNow + new Date(date.getFullYear(), date.getMonth(), 0).getDate() <= numberThen + 7))
        {
            setDateFormat(df(date, "DDDD"))
            return
        }   

        setDateFormat(df(date, "mmm d"))
    }

    const checkLike = () => {
        console.log(id, likes)
        if(likes && likes.includes(context.userId))
        {
            setLikeButton({...likeButton, color:red, childClassName: "fas fa-heart"})
            setMyLike(true)
        }
    }

    const onMouseEvent = (callback, color, childClassName, backgroundColor, ifVariable, obj) => {
        if(!ifVariable){
            callback({color, childClassName, backgroundColor})
        }
        else {
            callback({...obj, backgroundColor})
        }
    }

    const smashThatLikeButton = async () => {
        if(myLike)
        {
            setLikeButton({...likeButton, color:green, childClassName: "far fa-heart"})
            setMyLike(false)
            try {
                await request('/api/post/smash-that-like-button', 'POST', {Id:id, UserId: context.userId})
            } catch (e) {}
        }
        else 
        {
            setLikeButton({...likeButton, color:red, childClassName: "fas fa-heart"})
            setMyLike(true)
            try {
                await request('/api/post/smash-that-like-button', 'POST', {Id:id, UserId: context.userId})
            } catch (e) {}
        }
    }

    const wowComment = () => {
        setCommentButton({...commentButton, color: blue, childClassName: "fas fa-comments"})
        setMyComment(true)
    }

    useEffect(() => {
        setDateProperName()
        checkLike()
    }
    ,[])

    return(
        <div className="post-body">
            <span>@{userName}</span>
            <div className="post-content">
                <p>{content}</p>
            </div>
            <div className="post-footer">
                <ul>
                    <li id="li-date">{dateFormat}</li>
                    <li id="li-comment" 
                    style={{color:commentButton.color, backgroundColor: commentButton.backgroundColor}}   
                    onMouseEnter={() => onMouseEvent(setCommentButton, blue, "fas fa-comments", bgBlue, myComment, commentButton)} 
                    onMouseLeave={() => onMouseEvent(setCommentButton, green, "far fa-comments", null, myComment, commentButton)}
                    //onClick={wowComment}
                    ><i className={commentButton.childClassName}></i>{comments > 0 ? comments : null}</li>
                    <li 
                    id='li-like' 
                    style={{color:likeButton.color, backgroundColor: likeButton.backgroundColor}}  
                    onMouseEnter={() => onMouseEvent(setLikeButton, red, "fas fa-heart", bgRed, myLike, likeButton)} 
                    onMouseLeave={() => onMouseEvent(setLikeButton, green, "far fa-heart", null, myLike, likeButton)}
                    onClick={smashThatLikeButton}
                    ><i className={likeButton.childClassName}></i>{likes > 0 ? likes : null}</li>
                </ul>
            </div>
        </div>
    )
}