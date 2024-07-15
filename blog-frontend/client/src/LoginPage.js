import React,{useContext, useState} from "react";
import {Navigate} from 'react-router-dom'; 
import { UserContext } from "./UserContext";

export default function LoginPage(){

    const [userName,setUserName]=useState('');
    const [password,setPassword]=useState('');
    const [redirect,setRedirect]=useState(false);
    const {setUserInfo}=useContext(UserContext);

    async function handleLogin(e){
        e.preventDefault();

       if(!userName || !password){
        alert('Please Provide User credentials')
       }
       try {
        const response = await fetch('http://localhost:4000/api/login', {
            method: 'POST',
            body: JSON.stringify({ userName, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials:'include',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }else if(response.ok){
            response.json().then(userInfo=>{
                setUserInfo(userInfo);
                setRedirect(true);
            })
            
        }

        console.log('Registration successful');
    } catch (error) {
        console.error('Error registering:', error);
        alert('Registration Failed!!!!')
    }

    }
    if(redirect){
        return <Navigate to={'/'}/>
    }
    return(
        <form className="login"  onSubmit={handleLogin}>
            <h1>Login</h1>
            <input type="text" placeholder="Enter your Name" 
            value={userName} 
            onChange={e=>setUserName(e.target.value)}/>
            <input type="password" placeholder="Enter your password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)}/>
            <button type="submit">Login</button>

        </form>
    )
}