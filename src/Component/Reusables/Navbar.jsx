import React, { useState } from 'react'
import Logo from "../assets/modelrocket_ai_logo.png";
import { useNavigate } from 'react-router-dom';
import { PiEyeLight, PiEyeSlash } from "react-icons/pi";
import toast from 'react-hot-toast';


export const Navbar = () => {

    // For Modal
    const [inputDetails, setInputDetails] = useState({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const pageRender = useNavigate()


    const handlSubmitOnEnter = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (inputDetails.username === "" || inputDetails.password === "") {
            setError(true);
        } else {
            if (inputDetails.username === "matsuri" && inputDetails.password === "modelrocket"){
                setLoading(true);
                setError(false); 
                localStorage.setItem("isAdmin",true)
                document.getElementById("closeLoginModal").click();
                pageRender('/admin')
            }else{
                toast.error("Invalid credentials")
            }      
        }
    };

    const handleLogin = () =>{
        if(localStorage.getItem("isAdmin")){
            pageRender("/admin")
        }else{
            setInputDetails({
                username: "",
                password: "",
            })
            setError(false)
        }
    }


    return (
        <>
            <nav className="navbar nav-height overflow-hidden">
                <div className="container ">
                    <a className="navbar-brand" href="/">
                        <img src={Logo} alt="Logo" className='navLogo ' />
                    </a>
                    <div>
                    {
                        window.location.pathname === "/admin" ?
                        <button className='btn btn-primary' onClick={()=>{
                            localStorage.removeItem("isAdmin")
                            setError(false)
                            pageRender("/")
                        }}>Logout</button>
                        :
                        <button className='btn btn-primary' data-bs-toggle={localStorage.getItem("isAdmin") ? "" :"modal"} data-bs-target={localStorage.getItem("isAdmin") ? "" :"#loginModal"} onClick={handleLogin}>Configure</button>
                    }
                    </div>
                </div>
            </nav>

            {/* Login Modal */}
            <div className="modal fade" id="loginModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-bottom-0 text-center">
                            <h1 className="modal-title fs-4 ps-1" id="exampleModalLabel">Login</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeLoginModal"></button>

                        </div>
                        <div className="modal-body">

                            <form>
                                <div className="row gy-2 overflow-hidden px-3">
                                    <div className="col-12">
                                        <div className="mb-3">
                                            <label
                                                htmlFor="exampleInputEmail1"
                                                className="form-label"
                                            >
                                                Username <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                autoFocus
                                                type="username"
                                                className="form-control"
                                                id="username"
                                                aria-describedby="username"
                                                name="username"
                                                value={inputDetails.username}
                                                onChange={(e) =>
                                                    setInputDetails({
                                                        ...inputDetails,
                                                        [e.target.name]: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        {error && inputDetails.username === "" ? (
                                            <p className="text-danger mb-0 pb-2">
                                                Username is required
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="col-12">
                                        <div className="mb-3  password-container">
                                            <label htmlFor="password" className="form-label">
                                                Password <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                id="password"
                                                name="password"
                                                value={inputDetails.password}
                                                onChange={(e) =>
                                                    setInputDetails({
                                                        ...inputDetails,
                                                        [e.target.name]: e.target.value,
                                                    })
                                                }
                                                onKeyDown={handlSubmitOnEnter}
                                            />
                                            <span
                                                className="eye-icon fs-5"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <PiEyeLight /> : <PiEyeSlash />}
                                            </span>
                                        </div>
                                        {error && inputDetails.password === "" ? (
                                            <p className="text-danger mb-0 pb-2">
                                                Password is required
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}