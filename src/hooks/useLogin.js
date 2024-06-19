import { pb } from "../pocketbase"
import { useState } from "react"
import { useMutation } from 'react-query'

export default function useLogin() {
    async function login(data) {
        const authData = await pb.collection('users').authWithPassword(
            data.email,
            data.password,
        )
    }
}