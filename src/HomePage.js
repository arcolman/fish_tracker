import { pb } from './pocketbase'
import { Auth } from './Auth'
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group } from '@mantine/core';
import "./App.css"
import { useState } from 'react';
import CreatePost from './createPost';
import Posts from "./displayPosts"


function Home() {

    const [opened, { open, close }] = useDisclosure(false)
    const isLoggedIn = pb.authStore.isValid

    return (
        <div className="main">
            <Modal opened={opened} onClose={close} title={<strong>Authentication</strong>} >
                <Auth />
            </Modal>
            <div className='head'>
                <div className='profile'>
                    
                </div>
                <div className='icon'>
                    
                </div>
                <div className='authButtonDiv'>
                    <Button onClick={open} className="authButton" size="lg" color="violet" >{pb.authStore.isValid ? 'Log Out' : 'Log In'}</Button>
                </div>
            </div>
            <div className='posts'>
                <Posts />
            </div>
            <div className='createPosts'>
                <CreatePost />
            </div>
        </div>
    )
}

export default Home