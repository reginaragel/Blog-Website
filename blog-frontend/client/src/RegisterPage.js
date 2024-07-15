import React,{useState} from "react";
// import axios from 'axios';
export default function RegisterPage(){

    const [userName,setUserName]=useState('');
    const [password,setPassword]=useState('');


    async function handleSubmit(e) {
        e.preventDefault();
        console.log('Form submitted'); 
        console.log('Sending data:', { userName, password }); 
        if(!userName || !password){
            alert('Please Provide the user Credentials')
        }

        try {
            const response = await fetch('http://localhost:4000/api/register', {
                method: 'POST',
                body: JSON.stringify({ userName, password }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            alert('Registration Successful')
            console.log('Registration successful');
        } catch (error) {
            console.error('Error registering:', error);
            alert('Registration Failed!!!!')
        }
    }

    return(
        <form className="register" onSubmit={handleSubmit}>
            <h1>Register</h1>
           <input type="text" placeholder="Enter your Name"
           value={userName}
           onChange={e=>setUserName(e.target.value)}/>
           <input type="password" placeholder="Enter your password"
           value={password}
           onChange={e=>setPassword(e.target.value)}/>
           <button type="submit">Register</button>
        </form>
    )
}