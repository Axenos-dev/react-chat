import React, { useReducer } from 'react'
import JoinBlock from './components/JoinBlock'
import Chat from './components/Chat'
import reducer from './reducer'
import socket from './socket'
import axios from 'axios'

function App() {
	const [state, dispatch] = useReducer(reducer, {
		joined: false,
		roomId: null,
		userName: null,
		users: [],
		messages: [],
		date: new Date()
	})

	const onLogin = async (obj) => {
		dispatch({
			type: 'JOINED',
			payload: obj
		})
		socket.emit('room:join', obj)
		const { data } = await axios.get(`/rooms/${obj.roomId}`)

		setUsers(data.users)
	}

	const setUsers = users => {
		dispatch({
			type: 'SET_USERS',
			payload: users
		})
	}

	const addMessage = message => {
		dispatch({
			type: 'SET_MESSAGES',
			payload: message
		})
	}

	React.useEffect(() => {
		socket.on('room:joined', setUsers)
		socket.on('room:disconnected', setUsers)
		socket.on('room:new_message', addMessage)
	}, [])

	return (
		<div className = 'main'>
			{!state.joined ? <JoinBlock onLogin = {onLogin}/> : <Chat {...state} onAddMessage = {addMessage}/>}
		</div>
	);
}

export default App;
