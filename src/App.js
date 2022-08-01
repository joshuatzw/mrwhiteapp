import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { addPlayer, getPlayerList } from './services/firebase'
import GameContext from './store/GameContext';
import Home from './components/Home';
import Lobby from './components/Lobby'
import Game from './components/Game';
import Result from './components/Result';
import Modal from 'react-modal';

Modal.setAppElement('#root');
function App() {



// function populateList(name) {

// }

  return (
    <GameContext>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element = {<Home />}/>
            <Route path='/room/:id' element={<Lobby />}/>
            <Route path='/game/:id' element={<Game />}/>
            <Route path='/result/:id' element={<Result />}/>
          </Routes>
        </BrowserRouter>
      </div>
    </GameContext>
    
  );
}

export default App;

