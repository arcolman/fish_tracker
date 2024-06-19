import React from 'react'
import { pb } from './pocketbase'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import useLogout from './hooks/useLogout'
import { Button, Input } from '@mantine/core'
import { Alert } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import './App.css'

export function Auth(reloadVar, setReloadVar) {
    const logout = useLogout()
    const { register, handleSubmit, reset } = useForm()
    const [isLoading, setLoading] = useState(false)
    const [username1, setUsername1] = useState("")
    const [email1, setEmail1] = useState("")
    const [password1, setPassword1] = useState("")
    const [isLoading1, setIsLoading1] = useState(false)
    const [isError, setError] = useState(false)
    const [message, setMessage] = useState("Working")

    const isLoggedIn = pb.authStore.isValid

    function setUsernameValue(e) {
        setUsername1(e.target.value)
    }

    function setEmailValue(e) {
        setEmail1(e.target.value)
    }

    function setPasswordValue(e) {
        setPassword1(e.target.value)
    }

    async function createUser() {
        setIsLoading1(true);
        const userData = {
            "username": username1,
            "email": email1,
            "emailVisibility": true,
            "password": password1,
            "passwordConfirm": password1,
            "name": pb.authStore.model.id
        }
        try {
            const record = await pb.collection('users').create(userData);
            console.log("User created:", record);
            // Reset the form and loading state after a successful submission
            setUsername1("");
            setEmail1("");
            setPassword1("");
        } catch (error) {
            console.error("Error creating user:", error);
            // Handle the error and display a message to the user if necessary
        } finally {
            setIsLoading1(false);
        }
    }

    async function onSubmit(data) {
        login(data)
        reset()
    }

    async function login(data) {
        setLoading(true)
        console.log(data.email)
        try {
        const authData = await pb.collection('users').authWithPassword(
            data.email,
            data.password,
            )
        } catch (error){
            setError(true)
        }
        setLoading(false)
    }

    if (isLoggedIn)
        return (
            <>
                <h1 className='loggedInAs'>Logged In As: {pb.authStore.model.username}</h1>
                <Button color="violet" onClick={logout} className="logOutButton" size="lg" >Log out</Button>
            </>
        )


    return (
        <>
            {isLoading && <p style={{fontFamily: "sans-serif"}}>Loading...</p>}
            {isError && <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red" ></Alert>}

            <h1>Sign In</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Input.Wrapper label="Email" >
                    <Input type="text" {...register("email")} />
                </Input.Wrapper>
                <Input.Wrapper label="Password" >
                    <Input type="password" {...register("password")} />
                </Input.Wrapper>
                <Button type="submit" color="violet" disabled={isLoading} className='logInButton'>{isLoading ? "Loading" : "Login"}</Button>
            </form>
            <form onSubmit={(e) => { e.preventDefault(); createUser(); }}>
                <h3 styles={{wrap: "balanced"}}>Don't have an account? Make one below.</h3>
                <Input.Wrapper label="Username" >
                    <Input type="text" id="username" name="username" value={username1} onChange={setUsernameValue} />
                </Input.Wrapper>
                <Input.Wrapper label="Email" >
                    <Input type="email" id="email" name="email" value={email1} onChange={setEmailValue} />
                </Input.Wrapper>
                <Input.Wrapper label="Password" >
                    <Input type="password" id="password" name="password" value={password1} onChange={setPasswordValue} />
                </Input.Wrapper>
                <Button type="submit" color="violet" disabled={isLoading1} className="createAccButton" >{isLoading1 ? "Loading" : "Create Account"}</Button>
            </form>
        </>
    )
}

// export function CreateAccount() {
//     const [username, setUsername] = useState("")
//     const [email, setEmail] = useState("")
//     const [password, setPassword] = useState("")
//     const [isLoading, setIsLoading] = useState(false)
//     // const [dummy, setDummy] = useState(0)

//     const isLoggedIn = pb.authStore.isValid

//     function setUsernameValue(e) {
//         setUsername(e.target.value)
//     }

//     function setEmailValue(e) {
//         setEmail(e.target.value)
//     }

//     function setPasswordValue(e) {
//         setPassword(e.target.value)
//     }

//     async function createUser() {
//         setIsLoading(true);
//         const userData = {
//             "username": username,
//             "email": email,
//             "emailVisibility": true,
//             "password": password,
//             "passwordConfirm": password, // You might want to add password confirmation logic
//             "name": "test"
//         }
//         try {
//             const record = await pb.collection('users').create(userData);
//             console.log("User created:", record);
//             // Reset the form and loading state after a successful submission
//             setUsername("");
//             setEmail("");
//             setPassword("");
//         } catch (error) {
//             console.error("Error creating user:", error);
//             // Handle the error and display a message to the user if necessary
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     return(
//         <>
//             {
//             isLoggedIn
//                 ?
//                 <>
//                 </>
//             :
//             <>
//             {isLoading && <p>Loading...</p>}
//             <form onSubmit={(e) => { e.preventDefault(); createUser(); }}>
//                 <Input type="text" placeholder="username" id="username" name="username" value={username} onChange={setUsernameValue} />
//                 <Input type="email" placeholder="email" id="email" name="email" value={email} onChange={setEmailValue} />
//                 <Input type="password" placeholder="password" id="password" name="password" value={password} onChange={setPasswordValue} />
//                 <Button type="submit" color="violet" disabled={isLoading}>{isLoading ? "Loading" : "Create Account"}</Button>
//             </form>
//             </>
//             }
//         </>
//     )
// }