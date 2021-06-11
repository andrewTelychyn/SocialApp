import { useEffect, useState, useCallback } from "react"

export const useAuth = () => {
    let [token, setToken] = useState(null)
    let [userId, setUserId] = useState(null)
    let [date, setDate] = useState(new Date(Date.now()).getTime())

    let storageName = "UserData"

    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken)
        setUserId(id)

        localStorage.setItem(
            storageName,
            JSON.stringify({ userId: id, token: jwtToken, date })
        )
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)

        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.date && data.token) {
            const end = new Date(Date.now()).getTime()
            const hours =
                Math.floor((end - data.date) % (1000 * 60 * 60 * 24)) /
                (1000 * 60 * 60)
            if (hours <= 3) {
                login(data.token, data.userId)
                console.log(hours)
            } else {
                localStorage.removeItem(storageName)
            }
        }
    }, [login])

    return { login, logout, token, userId }
}
