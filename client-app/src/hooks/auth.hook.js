import {useEffect, useState, useCallback} from 'react'


export const useAuth = () => {
    let [token, setToken] = useState(null)
    let [userId, setUserId] = useState(null)
    
    let storageName = 'UserData'

    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken)
        setUserId(id)

        localStorage.setItem(storageName, JSON.stringify({userId:id, token:jwtToken}))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        localStorage.removeItem(storageName)
    }, [])


    useEffect(()=> {
        const data = JSON.parse(localStorage.getItem(storageName))

        if(data && data.token){
            login(data.token, data.userId)
        }

        
    },[login])


    return {login, logout, token, userId}
}