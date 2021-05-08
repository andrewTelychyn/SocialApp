import React, {useState, useContext} from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import {NavLink} from 'react-router-dom'

export const RegisterPage = () => {

    const {request} = useHttp()
    const auth = useContext(AuthContext)
    const path = require('path')

    let [form, setForm] = useState({Email:'', Password:'', Bio: '', Name:'', Photo: ''})
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
                const data2 = await fetch("https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/vprojectold1-tang-1474_2.jpg?w=1300&dpr=1&fit=default&crop=default&q=80&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=3ad8d7f89ccaa68eb265d67c62a1def0")
                const blob = await data2.blob()

                var reader = new FileReader()
                reader.readAsDataURL(blob)

                

                reader.onloadend = () => {
                    setForm({...form, Photo: reader.result.split(',')[1]})  
                }

                const data = await request('api/login/register', 'POST', {...form})
                console.log(data)

                if(data)
                {
                    //data should already have id and token 
                    auth.login(data.token, data.userId)
                }
            }
        } catch (e) {
            console.log(e.message)
            setForm({Email:'', Password:'', Bio: '', Name:''})
            setConfirmPassword('');

        }
    }

    return(
        <div className='container'>
            <div className='wrapper'>
                <div className='input-part left-borders'>
                    <h2>Create account</h2>
                    <input type="text" value={form.Name} placeholder='User Name' Name='Name' required onChange={changeHandler}/>
                    <input type="email" value={form.Email} placeholder='Email' Name='Email' required onChange={changeHandler}/>
                    <textarea placeholder="Bio" value={form.Bio} maxlength="75" Name='Bio' onChange={changeHandler}></textarea>
                    <input type="password" value={form.Password} placeholder='Password' maxlength="15" Name='Password' required onChange={changeHandler}/>
                    <input type="password"value={confirmPassword} placeholder='Confirm Password' maxlength="15" onChange={confirmPasswordHandler} required/>
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