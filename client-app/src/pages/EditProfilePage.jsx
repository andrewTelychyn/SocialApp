import React, {useState, useRef, useContext} from 'react'
import { AuthContext } from '../context/AuthContext'
import {NavLink} from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { useHistory } from "react-router-dom";

export const EditProfilePage = () => {
    const history = useHistory()
    const context = useContext(AuthContext)

    const {request} = useHttp()
    const [imageHover, setImageHover] = useState(false)
    const [profileData, setProfileData] = useState({
        Id: context.userId,
        Bio: context.bio, 
        Name: context.userName, 
        Email: context.email, 
        Photo: context.photo})

    const inputFile = useRef(null)

    const onChange = (event) => {
        setProfileData({...profileData, [event.target.name]: event.target.value})
    }

    const onChangeFile = (event) => {
        let file = event.target.files[0]

        var reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onloadend = () => {
            context.photo = reader.result
            setProfileData({...profileData, Photo: reader.result})
        }
    }


    const onMouseHover = (value) => {
        setImageHover(value)
    }

    const onFileButtonClick = () => {
        // `current` points to the mounted file input element
       inputFile.current.click();
    };

    const submit = async () => {
        try {
            const data = await request('/api/user/update', 'POST', {...profileData, Photo: profileData.Photo.split(',')[1]})
            history.push('/home')
        } catch (e) {
            
        }
    }

    return (
        <div className='container'>
            <div className='wrapper-sm edit-profile-body'>
                <div className='image-buffer'
                onMouseEnter={() => onMouseHover(true)}
                onMouseLeave={() => onMouseHover(false)}
                onClick={onFileButtonClick}
                >
                    <img className='profile-img'
                    src={profileData.Photo}
                    alt="profile-photo"
                    />
                    {imageHover &&
                    <div className='img-change'>
                        <i class="fas fa-camera"></i>
                        <input type='file' id='file' ref={inputFile} onChange={onChangeFile} accept="image/x-png,image/jpeg" style={{display: 'none'}}/>
                    </div>
                    }
                </div>
                <div className='form-group'>
                    <label htmlFor="input-name">USER NAME</label>
                    <input type="text" id='input-name' Name='Name' value={profileData.Name} onChange={onChange}/>
                </div>
                <div className='form-group'>
                    <label htmlFor="input-email">EMAIL</label>
                    <input type="email" id='input-email' Name='Email' value={profileData.Email} onChange={onChange} />
                </div>
                <div className='form-group'>
                    <label htmlFor="input-bio">BIO</label>
                    <textarea id='input-bio' maxLength="75" Name='Bio' value={profileData.Bio} onChange={onChange}></textarea>
                </div>
                <div className='button-group'>
                    <NavLink to='/profile'>BACK</NavLink>
                    <a onClick={submit}>SUBMIT</a>
                </div>
            </div>
        </div>
    )    
}