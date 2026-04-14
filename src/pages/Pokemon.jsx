import { useState, useEffect } from 'react';
import "./Pokemon.css";
import TypeDiagram from "../components/TypeDiagram.jsx";
import PokemonCard from "../components/PokemonCard.jsx";
import ZoekBalk from "../components/ZoekBalk.jsx";

function Pokemon() {
  const [generaties, setGeneraties] = useState([]);
  const [actieveGen, setActieveGen] = useState(0);
  const [pokemonPerGen, setPokemonPerGen] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [favorieten, setFavorieten] = useState(
    JSON.parse(localStorage.getItem('favorieten')) || []
  );

  useEffect(() => {
    async function laadGeneraties() {
      const response = await fetch('https://pokeapi.co/api/v2/generation');
      const data = await response.json();

      const generatiesMetLabel = data.results.map((generatie, index) => ({
        label: `Gen ${index + 1}`,
        url: generatie.url, 
      }));

      setGeneraties([
        ...generatiesMetLabel,
        { label: 'Alle', url: null },
        { label: 'Favorieten', url: 'favorieten' }
      ]);
    }

    laadGeneraties();
    laadGeneratie(0);
  }, []);

  useEffect(() => {
    function updateFavorieten() {
      setFavorieten(JSON.parse(localStorage.getItem('favorieten')) || []);
    }
    window.addEventListener('storage', updateFavorieten);
    return () => window.removeEventListener('storage', updateFavorieten);
  }, []);

  async function laadGeneratie(index) {
    const isAlGeladen = pokemonPerGen[index];
    if (isAlGeladen || !generaties[index]?.url || generaties[index]?.url === 'favorieten') return;

    setLoading(true);
    const response = await fetch(generaties[index].url);
    const data = await response.json();

    const details = await Promise.all(
      data.pokemon_species.map(soort => {
        const id = soort.url.split('/').filter(Boolean).pop();
        return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json());
      })
    );

    const gesorteerd = details.sort((a, b) => a.id - b.id);
    setPokemonPerGen(prev => ({ ...prev, [index]: gesorteerd }));
    setLoading(false);
  }

  function handleTab(index) {
    setActieveGen(index);
    setSearch('');
    if (generaties[index]?.url == null) {
      generaties.forEach((gen, i) => {
        if (gen.url && gen.url !== 'favorieten') laadGeneratie(i);
      });
    } else if (generaties[index]?.url !== 'favorieten') {
      laadGeneratie(index);
    }
  }

  function toggleFavoriet(pokemon) {
    const isAlFavoriet = favorieten.some(f => f.id === pokemon.id);
    const nieuweFavorieten = isAlFavoriet
      ? favorieten.filter(f => f.id !== pokemon.id)
      : [...favorieten, pokemon];

    setFavorieten(nieuweFavorieten);
    localStorage.setItem('favorieten', JSON.stringify(nieuweFavorieten));
    window.dispatchEvent(new Event('storage'));
  }

  const isFavorietenTabblad = generaties[actieveGen]?.url === 'favorieten';
  const isAlleTabblad = generaties[actieveGen]?.url == null;

  const huidigeLijst = isFavorietenTabblad
    ? favorieten
    : isAlleTabblad
      ? Object.values(pokemonPerGen).flat().sort((a, b) => a.id - b.id)
      : pokemonPerGen[actieveGen] || [];

  const gefilterd = search
    ? Object.values(pokemonPerGen).flat().filter(p => p.name.includes(search.toLowerCase()))
    : huidigeLijst;

  return (
    <>
      <div className="tabs">
        {generaties.map((generatie, index) => (
          <button
            key={index}
            className={`tab ${actieveGen === index ? 'actief' : ''}`}
            onClick={() => handleTab(index)}
          >
            {generatie.label}
          </button>
        ))}
      </div>

      <ZoekBalk waarde={search} onChange={setSearch} />

      <div className="pagina-layout">
        {loading ? (
          <p>Laden...</p>
        ) : (
          <div className="grid">
            {gefilterd.map(pokemon => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                isFavoriet={favorieten.some(f => f.id === pokemon.id)}
                onFavoriet={() => toggleFavoriet(pokemon)}
              />
            ))}
          </div>
        )}
        <TypeDiagram pokemonLijst={Object.values(pokemonPerGen).flat()} />
      </div>
    </>
  );
}

export default Pokemon;