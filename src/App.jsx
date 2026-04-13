import React, { useState, useEffect } from 'react';
import { Link, Routes, Route } from 'react-router';
import Home from './pages/Home.jsx';
import Test from './pages/Test.jsx';
import Pokemon from './pages/Pokemon.jsx';
      import PokemonDetail from './components/PokemonDetail.jsx';


const personen = [
  {
    "naam": "Charmander",
    "Type": "Fire",
    "Generation": "1"
  },
  {
    "naam": "Pikachu",
    "Type": "Electric",
    "Generation": "1"
  },
  {
    "naam": "Bulbasaur",
    "Type": "Grass",
    "Generation": "1"
  },
  {
    "naam": "Squirtle",
    "Type": "Water",
    "Generation": "1"
  },
  {
    "naam": "Mewtwo",
    "Type": "dark, psychic",
    "Generation": "1"
  }
];

function Pokemons({ naam, type, generation }) {
  return (
    <div className="namen">
      <p>
        <strong>{naam}</strong> <br />
        {type} <br />
        {generation}
      </p>
    </div>
  );
}

function Test2() {
  return (
    <>
      <h1>Welkom</h1>
      {
        personen.map((item) => {
          return (
            <Pokemon
              key={item.naam}
              naam={item.naam}
              type={item.Type}
              generation={item.Generation}
            />
          )
        })
      }
    </>
  );
}

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(json => {
        console.log("API Data:", json); 
        setTodos(json);
      });
  }, []);

  return(
    <>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/Test">Test</Link></li>
      <li><Link to="/pokemon">Pokémon</Link></li>
    </ul>

    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/Test" element={<Test/>}></Route>
      <Route path="/pokemon" element={<Pokemon />} />
      <Route path="/pokemon/:id" element={<PokemonDetail />} />
    </Routes>

    </>
  )
}

export default App;