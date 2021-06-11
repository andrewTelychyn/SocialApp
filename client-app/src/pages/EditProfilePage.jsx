import React, { useState, useRef, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { NavLink } from "react-router-dom"
import { useHttp } from "../hooks/http.hook"
import { useHistory } from "react-router-dom"

export const EditProfilePage = () => {
    const history = useHistory()
    const context = useContext(AuthContext)

    const { request } = useHttp()
    const [imageHover, setImageHover] = useState(false)
    const [profileData, setProfileData] = useState({
        Id: context.userId,
        Bio: context.bio,
        Name: context.userName,
        Email: context.email,
        Photo: context.photo,
    })

    const inputFile = useRef(null)

    const onChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.value,
        })
    }

    const onChangeFile = (event) => {
        const MAX_WIDTH = 720
        const MAX_HEIGHT = 480
        const MIME_TYPE = "image/jpeg"
        const QUALITY = 0.7

        let file = event.target.files[0]

        const blobURL = URL.createObjectURL(file)
        const img = new Image()
        img.src = blobURL
        img.onerror = function () {
            URL.revokeObjectURL(this.src)
            // Handle the failure properly
            console.log("Cannot load image")
        }
        img.onload = function () {
            URL.revokeObjectURL(this.src)
            const [newWidth, newHeight] = calculateSize(
                img,
                MAX_WIDTH,
                MAX_HEIGHT
            )

            const canvas = document.createElement("canvas")
            canvas.width = newWidth
            canvas.height = newHeight

            const ctx = canvas.getContext("2d")
            ctx.drawImage(img, 0, 0, newWidth, newHeight)

            canvas.toBlob(
                (blob) => {
                    // Handle the compressed image. es. upload or save in local state
                    console.log("Original file", file)
                    console.log("Compressed file", blob)

                    var reader = new FileReader()
                    reader.readAsDataURL(blob)
                    reader.onloadend = () =>
                        setProfileData({ ...profileData, Photo: reader.result })
                },
                MIME_TYPE,
                QUALITY
            )
        }
    }

    const calculateSize = (img, maxWidth, maxHeight) => {
        let width = img.width
        let height = img.height

        // calculate the width and height, constraining the proportions
        if (width > height) {
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width)
                width = maxWidth
            }
        } else {
            if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height)
                height = maxHeight
            }
        }
        return [width, height]
    }

    const onMouseHover = (value) => {
        setImageHover(value)
    }

    const onFileButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click()
    }

    const submit = async () => {
        try {
            const data = await request("/api/user/update", "POST", {
                ...profileData,
                Photo: profileData.Photo.split(",")[1],
            })
            context.photo = profileData.Photo
            history.push("/home")
        } catch (e) {}
    }

    return (
        <div className="container">
            <div className="wrapper-sm edit-profile-body">
                <div
                    className="image-buffer"
                    onMouseEnter={() => onMouseHover(true)}
                    onMouseLeave={() => onMouseHover(false)}
                    onClick={onFileButtonClick}
                >
                    <img
                        className="profile-img"
                        src={profileData.Photo}
                        alt="profile-photo"
                    />
                    {imageHover && (
                        <div className="img-change">
                            <i class="fas fa-camera"></i>
                            <input
                                type="file"
                                id="file"
                                ref={inputFile}
                                onChange={onChangeFile}
                                accept="image/x-png,image/jpeg"
                                style={{ display: "none" }}
                            />
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="input-name">USER NAME</label>
                    <input
                        type="text"
                        id="input-name"
                        Name="Name"
                        value={profileData.Name}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="input-email">EMAIL</label>
                    <input
                        type="email"
                        id="input-email"
                        Name="Email"
                        value={profileData.Email}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="input-bio">BIO</label>
                    <textarea
                        id="input-bio"
                        maxLength="75"
                        Name="Bio"
                        value={profileData.Bio}
                        onChange={onChange}
                    ></textarea>
                </div>
                <div className="button-group">
                    <NavLink to="/profile">BACK</NavLink>
                    <a onClick={submit}>SUBMIT</a>
                </div>
            </div>
        </div>
    )
}
