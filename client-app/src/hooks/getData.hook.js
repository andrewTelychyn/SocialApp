import {useCallback, useContext, useEffect} from 'react'
import {AuthContext} from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'

export const useData = () => {
    const {request} = useHttp()
    let context = useContext(AuthContext)
    
    const getAllData =  async () => {
    
        try {
            console.log(context.userId)
            const data = await request('api/user/getprofile', 'POST', {Id:context.userId})
            console.log('getting data')
            if(data) {
                context.bio = data.bio
                context.email = data.email
                context.userName = data.userName
                context.photo = data.photo
                
                context.posts = data.posts
                context.followers = data.followers
                context.following = data.following
            }
        } catch (e) {}
    }

    const getNumbers = useCallback( async () => {
    
        try {
            const data = await request('api/user/getprofile', 'POST', {Id:context.userId})
            if(data) {
                context.posts = data.posts
                context.followers = data.followers
                context.following = data.following
            }
        } catch (e) {}
    })

    useEffect(() => {
        console.log('maybe')
        getAllData()
    }, [getAllData])

    return {getAllData, getNumbers}
}

