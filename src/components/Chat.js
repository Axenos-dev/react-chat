import React from 'react'
import './chat-styles.css'
import socket from '../socket'

export default function Chat({users, messages, userName, roomId, onAddMessage, date}) {
    const [messageValue, setMessageValue] = React.useState('')

    const onSendMessage = () => {
        if(messageValue.trim()){

            socket.emit('room:new_message', {
                userName,
                roomId,
                text: messageValue,
                date
            })
            onAddMessage({
                userName,
                text: messageValue,
                date 
            })
            setMessageValue('')
        }
    }

    const checkSender = (sender) => {
        if(userName === sender) {
            return true
        } else {
            return false
        }
    }

    return (
        <div className = "chat">
            <div className = "chat-users">
                <b>Users({users.length})</b>
                <ul>
                    {
                        users.map((user, key) => <li key = {key}>{user}</li>)
                    }
                </ul>
            </div>
            <div className = "chat-messages">
                <div className = "messages">
                    {
                        messages.map((message, key) => {
                            const displayDate = `${message.date.getHours()}:${message.date.getMinutes()}`

                            if(checkSender(message.userName)){
                                console.log(message.date)
                                return(
                                    <div className = "messageClient" key = {key}>
                                        <div>
                                            <div>
                                                <span>{displayDate}</span>
                                            </div>
                                            <p>{message.text}</p>
                                            <div>
                                                <span>{message.userName}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            } else {
                                console.log(message.date)
                                return(
                                    <div className = "message" key = {key}>
                                        <div>
                                            <div>
                                                <span>{displayDate}</span>
                                            </div>
                                            <p>{message.text}</p>
                                            <div>
                                                <span>{message.userName}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            
                        })
                    }
                </div>
                <form>
                    <textarea rows = "3" value = {messageValue} onChange = {(e) => setMessageValue(e.target.value)}></textarea>
                    <button onClick = {onSendMessage} type = 'button'>Send</button>
                </form>
            </div>
        </div>
    )
}
