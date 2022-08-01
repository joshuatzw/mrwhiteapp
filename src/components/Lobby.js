import { useContext, useEffect, useLayoutEffect} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPlayerList, putIdentities, getRoomStatus, updateRoomStatus, putNumberOfSpiesInDB } from '../services/firebase';
import { GameContext } from '../store/GameContext';
import '../styles/Lobby.css'
import { spyCount, spyCountMoreThan10 } from '../data/gamedata';

export default function Lobby() {

  const resources = useContext(GameContext)
  
  const params = useParams();
  const navigate = useNavigate();

  function numberGenerator(target, playerCount){
    let numbersArray = []
    for (let i = 0; i < target; i++){
      numbersArray.push(Math.floor(Math.random() * playerCount))
    }
    
    // Set is a special data structure introduced in ES6
    // It can only contain unique values, so all non-uniques are filtered out
    // the Array.from() method converts SEt back to an Array
    const unique = Array.from(new Set(numbersArray));

    if (unique.length !== numbersArray.length) {
      numberGenerator(target, playerCount)
    } else {
      return (numbersArray)
    }
  }

  function startGame() {
    // Shuffle list of players
    let identities = [];
    let numberOfSpies = 0;
    const playerlength = resources.playerList.length

    // Identify No. Spies according to quantum
    if (playerlength > 10) {
      numberOfSpies = spyCountMoreThan10
    } else {
      numberOfSpies = spyCount[playerlength]
    }
    
    resources.setGlobalSpyCount(numberOfSpies)
    putNumberOfSpiesInDB(resources.room, numberOfSpies)
    //Everyone is a good guy first, in a separate array.
    for (let i = playerlength; i > 0; i--) {
      identities.push("good")
    }

    let spyArray = numberGenerator(numberOfSpies, playerlength)
    // console.log(spyArray.length)
    for (let i = 0; i < spyArray.length; i++) {
      identities[spyArray[i]] = "spy"
    }

    resources.setIdentityList(identities)
    
    // Sending this data to firebase. Room number, [players], [identities]
    putIdentities(resources.room, resources.playerList, identities)

    // Send word to players from data store
    updateRoomStatus(resources.room, resources.oompa, resources.setOompaboolean)

    // 
  }

  // NAVIGATE TO GAME SCREEN:
  // This useEffect hook triggers the snapshot in firebase and atttaches a QuerySnapshot listener to the base.
  useEffect(() => {
    getRoomStatus(resources.room, resources.setOompa, resources.setOompaboolean)
  }, [])

  // This hook navigates e once the boolean changes. 
  useEffect(() => {
  
    if (resources.oompaboolean === true) {
      navigate(`/game/${resources.room}`)
    }

  }, [resources.oompaboolean])



  return (
      <div className='text-container'>
        <h2> Room {resources.room} </h2>
        <h2 className='lobby-sub-heading'> Players: {/* {resources.playerList.length}  */} </h2>
        
          {resources.playerList.map((player)=>{
            return(
              <div className='player-container'>
                <span className='player-list-item' key={player}> {player} </span>
                <br />
              </div>
            )
          })}

          <br />
        

        <button className='homepage-button' onClick={startGame}> Start Game</button>
      </div>
        
  )
}