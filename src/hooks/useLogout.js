import { pb } from "../pocketbase"
import { useState } from "react"

export default function useLogout() {
    //dummy is to trigger a refresh in the logout code
    const [dummy, setDummy] = useState(0)

    //logs out the user using pocketbase auth function and sets dummy to a random number
    function logout() {
        pb.authStore.clear()
        setDummy(Math.random())
    }

    //returns the logout function
    return logout
}