import { useEffect, useState, useContext } from 'react'
import { Router, useNavigate } from 'react-router-dom'
import { addPlayer, getPlayerList, createGame, getRoomStatus } from '../services/firebase'
import { GameContext } from '../store/GameContext'
import '../styles/Home.css'

export default function Home() {

const resources = useContext(GameContext)

const [name, setName] = useState('')
const [room, setRoom] = useState('')
// const [playerList, setPlayerList] = useState([])
// const [introOn, setIntroOn] = useState(true)
const navigate = useNavigate();

function joinHandler(name, room) {
  let joinroomid = String(room);
  joinroomid = joinroomid.toUpperCase();
  resources.setName(name)
  resources.setRoom(joinroomid)
  addPlayer(name, joinroomid)
  getPlayerList(joinroomid, resources.setPlayerList)
  navigate(`/room/${joinroomid}`)
}

function createHandler(name) {

  // Generate a random number for the word
  let randomWordNumber = Math.floor(Math.random() * 63)

  // Generate Random Room UUID
  function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  let roomuuid = randomString(5, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  roomuuid = roomuuid.toUpperCase();
  
  resources.setName(name)
  resources.setRoom(roomuuid)
  createGame(name, roomuuid, randomWordNumber)
  //grabs room status doc id (oompa) and status itself (oompaboolean) in firebase - for some reason the word 'status' breaks the code.
  getRoomStatus(roomuuid, resources.setOompa, resources.setOompaboolean)
  getPlayerList(roomuuid, resources.setPlayerList)
  navigate(`/room/${roomuuid}`)
}


return (
  <div className="text-container">
    <div className='spacer' />
    <h1 className='homepage-text'> Mr White </h1>
    <input className='homepage-input' value={name} onChange={(e)=>{setName(e.target.value)}} placeholder="Name"/>
    <br />
    <input className='homepage-input' value={room} onChange={(e)=>{setRoom(e.target.value)}} placeholder="Room ID"/>
    <br />

    <button className='homepage-button' onClick={()=>{joinHandler(name, room)}}> Join a Game </button>
    <br />
    <button className='homepage-button' onClick={()=>{createHandler(name)}}> Create a Room </button>

        
  </div>
  )
}

// TODO:
// SET UP BROWSER ROUTER
// LINK TO LOBBY
// FINISH UP HOME TO LOBBY SEQUENCE 


        // <button onClick={()=>{
        //   (getPlayerList(room, setPlayerList))
        //   }}> View Data </button>



// import {Link, useParams} from 'react-router-dom';
// import { chatRooms } from '../../data/chatRooms';
// import MessageInput from '../MessageInput/MessageInput';
// import MessageList from '../MessageList/MessageList';


// return(
  // <BrowserRouter>
  //   <Routes>
  //     <Route path="/" element={<Landing />}/>
  //     <Route path='/room/:id' element={<ChatRoom />}/>
  //   </Routes>
  // </BrowserRouter>