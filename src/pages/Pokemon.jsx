import { useState, useEffect } from 'react';
import "./Pokemon.css";
import TypeDiagram from "../components/TypeDiagram.jsx";
import PokemonCard from "../components/PokemonCard.jsx";


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
      const response = await fetch('https://pokeapi.co/api/v2/generation'); //wacht op antwoord
      const data = await response.json(); // zet antwoord in json()

      const generatiesMetLabel = data.results.map((generatie, index) => ({ // Map over de data voor de links voor de generaties
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
      setFavorieten(JSON.parse(localStorage.getItem('favorieten')) || []); // haal de favorieten op uit de opgeslagen data
    }

    window.addEventListener('storage', updateFavorieten);
    return () => window.removeEventListener('storage', updateFavorieten); // houd in de gaten of er een favorieten word verwijderd of toegevoegd
  }, []);

  async function laadGeneratie(index) {
    const isAlGeladen = pokemonPerGen[index];
    if (isAlGeladen) return;
    if (!generaties[index]?.url) return;
    if (generaties[index]?.url == 'favorieten') return; // checkt of de data al eens eerder is geladen zodat hij geen nieuwe API call hoeft te doen

    setLoading(true);

    const response = await fetch(generaties[index].url);
    const data = await response.json();

    const details = await Promise.all(
      data.pokemon_species.map(soort => {
        const id = soort.url.split('/').filter(Boolean).pop(); // sliced de API URL en haalt de juiste ID eruit voor de foto
        return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
          .then(response => response.json());
      })
    );

    const gesorteerd = details.sort((a, b) => a.id - b.id);

    setPokemonPerGen(vorigeGeneraties => ({
      ...vorigeGeneraties,
      [index]: gesorteerd
    }));

    setLoading(false);
  }

  function handleTab(index) {
    setActieveGen(index);
    setSearch('');

    if (generaties[index]?.url == null) {
      generaties.forEach((generatie, generatieIndex) => {
        if (generatie.url && generatie.url !== 'favorieten') {
          laadGeneratie(generatieIndex);
        }
      });
    } else if (generaties[index]?.url !== 'favorieten') {
      laadGeneratie(index);
    }
  }

  function toggleFavoriet(pokemon) {
    const isAlFavoriet = favorieten.some(favoriet => favoriet.id == pokemon.id);

    const nieuweFavorieten = isAlFavoriet
      ? favorieten.filter(favoriet => favoriet.id !== pokemon.id)
      : [...favorieten, pokemon];

    setFavorieten(nieuweFavorieten);
    localStorage.setItem('favorieten', JSON.stringify(nieuweFavorieten));
    window.dispatchEvent(new Event('storage'));
  }

  const isFavorietenTabblad = generaties[actieveGen]?.url == 'favorieten';
  const isAlleTabblad = generaties[actieveGen]?.url == null;

  const huidigeLijst = isFavorietenTabblad
    ? favorieten
    : isAlleTabblad
      ? Object.values(pokemonPerGen).flat().sort((a, b) => a.id - b.id)
      : pokemonPerGen[actieveGen] || [];

  const alleLadenPokemon = Object.values(pokemonPerGen).flat();

  const gefilterd = search
    ? alleLadenPokemon.filter(pokemon =>
      pokemon.name.includes(search.toLowerCase())
    )
    : huidigeLijst;

  return (
    <>
      <div className="tabs">
        {generaties.map((generatie, index) => (
          <button
            key={index}
            className={`tab ${actieveGen == index ? 'actief' : ''}`}
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

      <div className="pagina-layout">
        {loading ? (
          <p>Laden...</p>
        ) : (
          <div className="grid">
            {gefilterd.map(pokemon => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onNavigeer={(id) => window.location.href = `/pokemon/${id}`}
                isFavoriet={favorieten.some(favoriet => favoriet.id == pokemon.id)}
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