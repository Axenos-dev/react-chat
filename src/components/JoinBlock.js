import React, {useState} from 'react'
import '../style.css'
import axios from 'axios'

export default function JoinBlock({onLogin}) {
	const [roomId, setRoomId] = useState('')
	const [userName, setUserName] = useState('')
	const [isLoading, setLoading] = useState(false)

	const onEnter = async () => {
		if(!roomId.trim() || !userName.trim()) return alert('Wrong data')

		setLoading(true)

		const obj = {
			roomId,
			userName
		}
		
		await axios.post('/rooms', obj)
		onLogin(obj)
	}
    return (
        <div className = 'join-block'>
			<input type = 'text' placeholder = 'Room id' className = 'input' value = {roomId} onChange = {e => setRoomId(e.target.value)}/>
			<input type = 'text' placeholder = 'Nick name' className = 'input' value = {userName} onChange = {e => setUserName(e.target.value)}/>
			<button disabled = {isLoading} className = 'join-btn' onClick = {onEnter}>{ isLoading ? "Connecting..." : "Join"}</button>
		</div>
    )
}
