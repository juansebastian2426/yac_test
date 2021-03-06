import React, { useEffect, useState } from 'react'
import useUser, { userState } from '../hooks/useUser'
import { useHistory } from 'react-router-dom'
import { sendChat, readChats } from '../service/chat.service'
import { signOut } from '../service/auth.service'
import './chat.css'


export default function Chat() {

    const user = useUser()
    const history = useHistory()
    const [message, setMessage] = useState('')
    const [chats, setChats] = useState([])
    const [loadingMessages, setLoadingMessages] = useState(true)


    const onHandleSubmit = evt => {
        evt.preventDefault()
        
        if(message !== ''){
            sendChat(user.email, message)
            setMessage('')
        }
    }

    useEffect(() => {
        let unsubscribe
        if(user){
            unsubscribe = readChats((mss) => {
                setChats(mss)
                setLoadingMessages(false)
                let elem = document.getElementById('chat-messages')
                elem.scrollTop = elem.scrollHeight
            })            
        }
        return () => unsubscribe && unsubscribe()
    }, [user])

    const closeSession = () => {
        signOut().then(() => {
            history.replace('/')
        })
    }

    return (
        <>
            
            <div className='chat'>
                <button className='btn btn-primary' onClick={closeSession}>
                    Sing Out
                </button>
                <div>
                    <div className='chat-messages' id='chat-messages'>
                        {loadingMessages && <div className='d-flex justify-content-center align-items-center'><div className='spinner-border text-primary'></div></div>}
                        {chats.map(chat => (
                            <div className='chat-message' key={chat.id}>
                                {chat.message}
                                <small>{`${chat.createdAt.toDateString()} - ${chat.createdAt.getHours()}:${chat.createdAt.getMinutes()}   ${chat.email}`}</small>
                            </div>
                        ))}
                    </div>
                    <div className='chat-bottom'>
                        <form onSubmit={onHandleSubmit}>
                            <input type='text' placeholder='type a message...' value={message} onChange={evt => setMessage(evt.target.value)}/>
                            <button>></button>
                        </form>                        
                    </div>
                </div>                
            </div>
        </>
    )
}