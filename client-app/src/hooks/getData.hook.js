import { useCallback, useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useHttp } from "../hooks/http.hook"

export const useData = (userId) => {
    const { request } = useHttp()

    let [data, setData] = useState({
        bio: "",
        email: "",
        userName: "",
        photo: "",
        followers: 0,
        following: 0,
        posts: 0,
    })

    const getAllData = async () => {
        try {
            const data = await request("api/user/getprofile", "POST", {
                Id: userId,
            })
            if (data) {
                setData({
                    bio: data.bio,
                    email: data.email,
                    userName: data.name,
                    photo: data.photo,

                    posts: data.postsIds,
                    followers: data.subscribersUserIds,
                    following: data.subscriptionsUserIds,
                })
                console.log("data", data)
            }
        } catch (e) {}
    }

    useEffect(() => {
        getAllData()
    }, [userId])

    return { getAllData, data }
}
