import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import "./Pokemon.css";

const TYPE_CHART = {
  fire: { sterk_tegen: ['grass', 'ice', 'bug', 'steel'], zwak_tegen: ['water', 'rock', 'fire'] },
  water: { sterk_tegen: ['fire', 'ground', 'rock'], zwak_tegen: ['grass', 'electric'] },
  grass: { sterk_tegen: ['water', 'ground', 'rock'], zwak_tegen: ['fire', 'ice', 'poison', 'flying', 'bug'] },
  electric: { sterk_tegen: ['water', 'flying'], zwak_tegen: ['ground'] },
  psychic: { sterk_tegen: ['fighting', 'poison'], zwak_tegen: ['bug', 'ghost', 'dark'] },
  poison: { sterk_tegen: ['grass', 'fairy'], zwak_tegen: ['ground', 'psychic'] },
  normal: { sterk_tegen: [], zwak_tegen: ['fighting'] },
  flying: { sterk_tegen: ['grass', 'fighting', 'bug'], zwak_tegen: ['rock', 'electric', 'ice'] },
  bug: { sterk_tegen: ['grass', 'psychic', 'dark'], zwak_tegen: ['fire', 'flying', 'rock'] },
  ground: { sterk_tegen: ['fire', 'electric', 'poison', 'rock'], zwak_tegen: ['water', 'grass', 'ice'] },
  rock: { sterk_tegen: ['fire', 'ice', 'flying', 'bug'], zwak_tegen: ['water', 'grass', 'fighting', 'ground', 'steel'] },
  ice: { sterk_tegen: ['grass', 'ground', 'flying', 'dragon'], zwak_tegen: ['fire', 'fighting', 'rock', 'steel'] },
  dragon: { sterk_tegen: ['dragon'], zwak_tegen: ['ice', 'dragon', 'fairy'] },
  ghost: { sterk_tegen: ['ghost', 'psychic'], zwak_tegen: ['ghost', 'dark'] },
  dark: { sterk_tegen: ['ghost', 'psychic'], zwak_tegen: ['fighting', 'bug', 'fairy'] },
  steel: { sterk_tegen: ['ice', 'rock', 'fairy'], zwak_tegen: ['fire', 'fighting', 'ground'] },
  fairy: { sterk_tegen: ['fighting', 'dragon', 'dark'], zwak_tegen: ['poison', 'steel'] },
  fighting: { sterk_tegen: ['normal', 'ice', 'rock', 'dark'], zwak_tegen: ['flying', 'psychic', 'fairy'] },
};

const STAT_NAMEN = {
  hp: 'HP',
  attack: 'Aanval',
  defense: 'Verdediging',
  'special-attack': 'Sp. Aanval',
  'special-defense': 'Sp. Verdediging',
  speed: 'Snelheid',
};

function PokemonDetail() {
  const { id } = useParams();
  const navigeer = useNavigate();

  const [pokemon, setPokemon] = useState(null);
  const [soort, setSoort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorieten, setFavorieten] = useState(
    JSON.parse(localStorage.getItem('favorieten')) || []
  );

  const isFavoriet = favorieten.some(favoriet => favoriet.id == pokemon?.id);

  function toggleFavoriet() {
    const nieuweFavorieten = isFavoriet
      ? favorieten.filter(favoriet => favoriet.id !== pokemon.id)
      : [...favorieten, pokemon];

    setFavorieten(nieuweFavorieten);
    localStorage.setItem('favorieten', JSON.stringify(nieuweFavorieten));
    window.dispatchEvent(new Event('storage'));
  }

  useEffect(() => {
    async function laadPokemon() {
      setLoading(true);

      const [pokemonResponse, soortResponse] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
      ]);

      const pokemonData = await pokemonResponse.json();
      const soortData = await soortResponse.json();

      setPokemon(pokemonData);
      setSoort(soortData);
      setLoading(false);
    }

    laadPokemon();
  }, [id]);

  if (loading) return <p>Laden...</p>;
  if (!pokemon) return <p>Pokémon niet gevonden.</p>;

  const pokedexBeschrijving = soort?.flavor_text_entries
    .find(beschrijving => beschrijving.language.name == 'en')
    ?.flavor_text
    .replace(/\f/g, ' ')
    .replace(/POKéMON/g, 'Pokémon')
    .replace(/POKÉMON/g, 'Pokémon');

  const sterkTegen = [...new Set(
    pokemon.types.flatMap(type => TYPE_CHART[type.type.name]?.sterk_tegen || [])
  )];
  const zwakTegen = [...new Set(
    pokemon.types.flatMap(type => TYPE_CHART[type.type.name]?.zwak_tegen || [])
  )];

  return (
    <div className="detail-pagina">

      <button className="terug-knop" onClick={() => navigeer(-1)}>
        Terug
      </button>

      <div className="detail-header">
        <img
          src={pokemon.sprites?.other['official-artwork']?.front_default}
          alt={pokemon.name}
          className="detail-afbeelding"
        />
        <div>
          <div className="detail-naam-rij">
            <h1 className="detail-naam">{pokemon.name}</h1>
            <button
              className={`favoriet-knop-detail ${isFavoriet ? 'favoriet-actief' : ''}`}
              onClick={toggleFavoriet}
            >
              {isFavoriet ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
          <p className="detail-nummer">#{String(pokemon.id).padStart(3, '0')}</p>
          <div>
            {pokemon.types.map(type => (
              <span key={type.type.name} className={`badge type-${type.type.name}`}>
                {type.type.name}
              </span>
            ))}
          </div>
          {pokedexBeschrijving && (
            <p className="detail-beschrijving">{pokedexBeschrijving}</p>
          )}
        </div>
      </div>

      <div className="detail-secties">
        <div className="detail-sectie">
          <h2>Stats</h2>
          {pokemon.stats.map(stat => (
            <div key={stat.stat.name} className="stat-rij">
              <span className="stat-naam">{STAT_NAMEN[stat.stat.name] || stat.stat.name}</span>
              <span className="stat-waarde">{stat.base_stat}</span>
            </div>
          ))}
        </div>

        <div className="detail-sectie">
          <h2>Type voordelen</h2>
          <p className="sectie-label">Sterk tegen</p>
          <div>
            {sterkTegen.map(type => (
              <span key={type} className={`badge type-${type}`}>{type}</span>
            ))}
          </div>
          <p className="sectie-label">Zwak tegen</p>
          <div>
            {zwakTegen.map(type => (
              <span key={type} className={`badge type-${type}`}>{type}</span>
            ))}
          </div>
        </div>

        <div className="detail-sectie">
          <h2>Moves</h2>
          <div className="moves-grid">
            {pokemon.moves.slice(0, 20).map(move => (
              <span key={move.move.name} className="move-badge">
                {move.move.name.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;