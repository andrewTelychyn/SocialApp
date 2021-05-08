import React, {useState, useRef} from 'react'
import {NavLink} from 'react-router-dom'

export const EditProfilePage = () => {


    const [imageHover, setImageHover] = useState(false)
    const [imageSrc, setImageSrc] = useState("https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80")
    const [profileData, setProfileDate] = useState({Bio: "Just chillin", Name:"Ivan", Email:'endriktel@gmail.com' })

    const inputFile = useRef(null)

    const onChange = (event) => {
        setProfileDate({...profileData, [event.target.name]: event.target.value})
    }

    const onChangeFile = (event) => {
        let file = event.target.files[0]

        console.log(file)
        var reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onloadend = () => {
            setImageSrc(reader.result)
        }
    }


    const onMouseHover = (value) => {
        setImageHover(value)
    }

    const onFileButtonClick = () => {
        // `current` points to the mounted file input element
       inputFile.current.click();
      };


    return (
        <div className='container'>
            <div className='wrapper-sm edit-profile-body'>
                <div className='image-buffer'
                onMouseEnter={() => onMouseHover(true)}
                onMouseLeave={() => onMouseHover(false)}
                onClick={onFileButtonClick}
                >
                    <img className='profile-img'
                    src={imageSrc}
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
                    <textarea id='input-bio' maxlength="75" Name='Bio' value={profileData.Bio} onChange={onChange}></textarea>
                </div>
                <div className='button-group'>
                    <NavLink to='/profile'>BACK</NavLink>
                    <a>SUBMIT</a>
                </div>
            </div>
        </div>
    )    
}