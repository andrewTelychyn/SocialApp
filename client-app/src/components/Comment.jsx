import React, {useState } from 'react'

export const Comment = () => {

    const likes = 12

    const green = "#36B08F"
    const red = "#E0245E"
    const bgRed = "#F5E2E8"


    const [likeButton, setLikeButton] = useState({color: green, childClassName: "far fa-heart", backgroundColor: null}) 
    
    const [myLike, setMyLike] = useState(false)


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

    return(
        <div className="comment-body">
            <div className='comment-header'>
                <span>@pedro</span>
                <i class="fas fa-circle"></i>
                <p>16:48</p>
            </div>
            <div className='comment-main'>
                <div className="comment-content">
                    <p>Hey, thats cool man</p>
                </div>
                <div className='like-button'
                style={{color:likeButton.color, backgroundColor: likeButton.backgroundColor}}  
                onMouseEnter={() => onMouseEvent(setLikeButton, red, "fas fa-heart", bgRed, myLike, likeButton)} 
                onMouseLeave={() => onMouseEvent(setLikeButton, green, "far fa-heart", null, myLike, likeButton)}
                onClick={smashThatLikeButton}
                ><i className={likeButton.childClassName}></i>{likes > 0 ? likes : null}</div>
            </div>
        </div>
    )
}