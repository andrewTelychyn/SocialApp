import React, {useState } from 'react'

export const Post = () => {

    const likes = 12
    const comments = 2


    const green = "#36B08F"
    const blue = "#55B8F5"
    const red = "#E0245E"
    const bgRed = "#F5E2E8"
    const bgBlue = "#E1EEF7"


    const [likeButton, setLikeButton] = useState({color: green, childClassName: "far fa-heart", backgroundColor: null}) 
    const [commentButton, setCommentButton] = useState({color: green, childClassName: "far fa-comments", backgroundColor: null})
    
    const [myLike, setMyLike] = useState(false)
    const [myComment, setMyComment] = useState(false)


    const onMouseEvent = (callback, color, childClassName, backgroundColor, ifVariable, obj) => {
        if(!ifVariable){
            callback({color, childClassName, backgroundColor})
        }
        else {
            callback({...obj, backgroundColor})
        }
    }

    const smashThatLikeButton = () => {
        if(myLike)
        {
            setMyLike(false)
        }
        else 
        {
            setMyLike(true)
        }
    }

    const wowComment = () => {
        setCommentButton({...commentButton, color: blue, childClassName: "fas fa-comments"})
        setMyComment(true)
    }

    return(
        <div className="post-body">
            <span>@andrew</span>
            <div className="post-content">
                <p>Hey, I found out that I love dicks... Im so excited!!!</p>
            </div>
            <div className="post-footer">
                <ul>
                    <li id="li-date">16:30</li>
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