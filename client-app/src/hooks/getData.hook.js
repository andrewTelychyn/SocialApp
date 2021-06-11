import { useEffect, useState } from "react"
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
    let [changed, setChanged] = useState(false)

    let storageName = "UserProfileData"

    const getAllData = async () => {
        if (!userId) return

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

                localStorage.setItem(storageName, JSON.stringify({ ...data }))
                console.log("wrote into storage")
            }
        } catch (e) {}
    }

    useEffect(() => {
        getAllData()
    }, [userId])

    useEffect(() => {
        if (changed) {
            getAllData()
        } else {
            const data = JSON.parse(localStorage.getItem(storageName))

            setData({
                bio: data.bio,
                email: data.email,
                userName: data.name,
                photo: data.photo,

                posts: data.postsIds,
                followers: data.subscribersUserIds,
                following: data.subscriptionsUserIds,
            })
        }
    }, [changed])

    return { getAllData, data }
}
