import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router';

function PokemonCard({ pokemon, isFavoriet, onFavoriet }) {
  const navigate = useNavigate(); 

  return (
    <div className="card" onClick={() => navigate(`/pokemon/${pokemon.id}`)}>
      <button
        className={`favoriet-knop ${isFavoriet ? 'favoriet-actief' : ''}`}
        onClick={gebeurtenis => {
          gebeurtenis.stopPropagation();
          onFavoriet();
        }}
      >
        {isFavoriet ? <FaHeart /> : <FaRegHeart />}
      </button>

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

export default PokemonCard;