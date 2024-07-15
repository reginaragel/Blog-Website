import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header(){
    
    const {setUserInfo,userInfo}=useContext(UserContext);
    
    useEffect(()=>{
        fetch('http://localhost:4000/api/profile',{
            credentials:'include',
        })
        .then(response=>{
            response.json()
            .then(userInfo=>{
              
               setUserInfo(userInfo);
            })
            .catch(error=>{
                console.error('Error Fetching Profile',error);
            })
        })
    },[])

    function logout(){
        fetch('http://localhost:4000/api/logout',{
            credentials:'include',
            method:'POST',
        })
       
        setUserInfo(null);
    }

    const userName=userInfo?.userName;
    return(
        <header>
            <Link to="/" className="logo">MyBlog</Link>
            <nav>
                {userName &&(
                    <>
                   <Link to="/create">Create new post</Link>
                   <a onClick={logout}>Logout</a>
                   </>
                )}
                {!userName && (
                   <>
                   <Link to="/login">Login</Link>
                   <Link to="/register">Register</Link>
                   </>
                )}
                
            </nav>
        </header>
    )
}