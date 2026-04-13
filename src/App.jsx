import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router';
import Home from './pages/Home';
import Test from './pages/Test';
import Pokemon from './pages/Pokemon.jsx';
import PokemonDetail from './components/PokemonDetail.jsx';
import './pages/Pokemon.css';

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

  return (
    <>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/Test">Test</Link></li>
          <li><Link to="/pokemon">Pokémon</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Test" element={<Test />} />
        <Route path="/pokemon" element={<Pokemon />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
      </Routes>
    </>
  );
}

export default App;