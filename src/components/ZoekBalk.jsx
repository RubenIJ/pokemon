function ZoekBalk({ waarde, onChange }) {
  return (
    <input
      type="text"
      placeholder="Zoek een Pokémon..."
      value={waarde}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default ZoekBalk;