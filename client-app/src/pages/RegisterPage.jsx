import React, {useState, useContext} from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import {NavLink} from 'react-router-dom'

export const RegisterPage = () => {

    const {request} = useHttp()
    const auth = useContext(AuthContext)

    let [form, setForm] = useState({Email:'', Password:'', Bio: '', Name:''})
    let [confirmPassword, setConfirmPassword] = useState('');


    const changeHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})        
    }

    const confirmPasswordHandler = (event) => {
        setConfirmPassword(event.target.value);
    }

    const registerHandler = async (event) => {
        //event.preventDefault()
        try {
            if(form.Password === confirmPassword)
            {
                const data = await request('api/login/register', 'POST', {...form})
                if(data)
                {
                    //data should already have id and token 
                    auth.login(data.token, data.userId)
                }
            }
        } catch (e) {}
    }

    return(
        <div className='container'>
            <div className='wrapper'>
                <div className='input-part left-borders'>
                    <h2>Create account</h2>
                    <input type="text" placeholder='User Name' Name='Name' required onChange={changeHandler}/>
                    <input type="email" placeholder='Email' Name='Email' required onChange={changeHandler}/>
                    <textarea placeholder="Bio" maxlength="75" Name='Bio' onChange={changeHandler}></textarea>
                    <input type="password" placeholder='Password' maxlength="15" Name='Password' required onChange={changeHandler}/>
                    <input type="password" placeholder='Confirm Password' maxlength="15" onChange={confirmPasswordHandler} required/>
                    <input type="submit" value='SIGN UP' onClick={registerHandler}/>
                </div>
                <div className='hello-part right-borders'>
                    <h2>Hello, friend!</h2>
                    <p>Or just login if you already have an account</p>
                    <NavLink to="/login">SING IN</NavLink>
                </div>
            </div>
                
        </div>
    )
}