import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import "./Pokemon.css";

const GENERATIES = [
  { label: 'Gen 1', url: 'https://pokeapi.co/api/v2/generation/1' },
  { label: 'Gen 2', url: 'https://pokeapi.co/api/v2/generation/2' },
  { label: 'Gen 3', url: 'https://pokeapi.co/api/v2/generation/3' },
  { label: 'Gen 4', url: 'https://pokeapi.co/api/v2/generation/4' },
  { label: 'Gen 5', url: 'https://pokeapi.co/api/v2/generation/5' },
  { label: 'Gen 6', url: 'https://pokeapi.co/api/v2/generation/6' },
  { label: 'Gen 7', url: 'https://pokeapi.co/api/v2/generation/7' },
  { label: 'Gen 8', url: 'https://pokeapi.co/api/v2/generation/8' },
  { label: 'Gen 9', url: 'https://pokeapi.co/api/v2/generation/9' },
];

function PokemonCard({ pokemon }) {
  const navigeer = useNavigate();

  return (
    <div className="card" onClick={() => navigeer(`/pokemon/${pokemon.id}`)}>
      <img src={pokemon.sprites?.front_default} alt={pokemon.name} />
      <h3>{pokemon.name}</h3>
      <div>
        {pokemon.types.map(type => (
          <span key={type.type.name} className={`badge type-${type.type.name}`}>
            {type.type.name}
          </span>
        ))}
      </div>
    </div>
  );
}


function Pokemon() {

  const [actieveGen, setActieveGen] = useState(0);
  const [pokemonPerGen, setPokemonPerGen] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');


  async function laadGeneratie(index) {
    const isAlGeladen = pokemonPerGen[index];
    if (isAlGeladen) return;

    setLoading(true);

    const response = await fetch(GENERATIES[index].url);
    const data = await response.json();

    const details = await Promise.all(
      data.pokemon_species.map(soort => {
        const id = soort.url.split('/').filter(Boolean).pop(); // Haal het ID uit de URL
        return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
          .then(response => response.json());
      })
    );

    const gesorteerd = details.sort((a, b) => a.id - b.id); // Sorteer op ID (laagste eerst)

  
    setPokemonPerGen(vorigeGeneraties => ({ ...vorigeGeneraties, [index]: gesorteerd }));
    setLoading(false);
  }

  useEffect(() => {
    laadGeneratie(0);
  }, []);

  function handleTab(index) {
    setActieveGen(index);  // Wissel naar het aangeklikte tabblad
    setSearch('');          // Reset de zoekbalk
    laadGeneratie(index);  // Laad de Pokémon als dat nog niet gebeurd is
  }

const alleLadenPokemon = Object.values(pokemonPerGen).flat();

const gefilterd = search
  ? alleLadenPokemon.filter(pokemon =>
      pokemon.name.includes(search.toLowerCase())
    )
  : pokemonPerGen[actieveGen] || [];

  return (
    <>
      <div className="tabs">
        {GENERATIES.map((generatie, index) => (
          <button
            key={index}
            className={`tab ${actieveGen === index ? 'actief' : ''}`}
            onClick={() => handleTab(index)}
          >
            {generatie.label}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Zoek een Pokémon..."
        value={search}
        onChange={gebeurtenis => setSearch(gebeurtenis.target.value)}
      />

      {loading ? (
        <p>Laden...</p>
      ) : (
        <div className="grid">
          {gefilterd.map(pokemon => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}
    </>
  );
}

export default Pokemon;