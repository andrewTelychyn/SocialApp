import React, { useContext, useState } from "react"
import { NavLink } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { useHttp } from "../hooks/http.hook"

export const LoginPage = () => {
    const { request } = useHttp()
    const auth = useContext(AuthContext)

    let [form, setForm] = useState({ Email: "", Password: "" })

    const changeHandler = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const loginHandler = async () => {
        if (form.Email.trim() === "" || form.Password.trim() === "") return

        try {
            const data = await request("/api/login", "POST", { ...form })
            auth.login(data.token, data.userId)
        } catch (e) {
            setForm({ Email: "", Password: "" })
        }
    }

    return (
        <div className="container">
            <div className="wrapper">
                <div className="hello-part left-borders">
                    <h2>Welcome back!</h2>
                    {/* <p>Enter your personal details and start journey with us</p> */}
                    <p>
                        Or if you haven't account go through fast registration
                    </p>
                    {/* <p id='or-p'>Or if you have account</p> */}
                    <NavLink to="/register">SING UP</NavLink>
                </div>
                <div className="input-part right-borders">
                    <h2>Sing in to BitterSweet</h2>
                    <input
                        type="email"
                        value={form.Email}
                        placeholder="Email"
                        Name="Email"
                        required
                        onChange={changeHandler}
                    />
                    <input
                        type="password"
                        value={form.Password}
                        placeholder="Password"
                        Name="Password"
                        maxlength="15"
                        required
                        onChange={changeHandler}
                    />
                    <div className="input-buttons">
                        <input
                            type="submit"
                            value="SIGN IN"
                            onClick={loginHandler}
                        />
                        <NavLink to="/register">SING UP</NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}
