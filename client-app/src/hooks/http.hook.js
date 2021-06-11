import { useCallback, useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const context = useContext(AuthContext)

    const request = useCallback(
        async (url, method = "GET", body = null, headers = {}) => {
            try {
                setLoading(true)
                if (body) {
                    body = JSON.stringify(body)
                    headers["Content-Type"] = "application/json"
                }
                if (context.token) {
                    //headers["Accept"] = "application/json"
                    headers["Authorization"] = `Bearer ${context.token}`
                    //console.log(true)
                }

                const response = await fetch(url, { method, body, headers })
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || "Something went wrong")
                }
                setLoading(false)

                return data
            } catch (e) {
                setLoading(false)
                setError(e.message)
                throw e
            }
        },
        []
    )
    const clearError = useCallback(() => setError(null), [])

    return { loading, request, error, clearError }
}
