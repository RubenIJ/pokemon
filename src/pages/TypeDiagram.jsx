import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

function TypeDiagram({ pokemonLijst }) {
    const typeAantallen = {};

    pokemonLijst.forEach(pokemon => {
        pokemon.types.forEach(type => {
            const typNaam = type.type.name;
            typeAantallen[typNaam] = (typeAantallen[typNaam] || 0) + 1;
        });
    });

    const data = Object.entries(typeAantallen)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

    const TYPE_KLEUREN = {
        fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
        psychic: '#F85888', poison: '#A040A0', normal: '#A8A878', flying: '#A890F0',
        bug: '#A8B820', ground: '#E0C068', rock: '#B8A038', ice: '#98D8D8',
        dragon: '#7038F8', ghost: '#705898', dark: '#705848', steel: '#B8B8D0',
        fairy: '#EE99AC', fighting: '#C03028',
    };

    if (data.length == 0) return null;

    return (
        <div className="diagram-sectie" style={{ width: '100%', height: 450 }}>
            <h2 style={{ marginBottom: '20px' }}>Top 10 types in collectie</h2>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                    >
                        {data.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={TYPE_KLEUREN[entry.name] || '#ccc'} stroke="#fff" />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default TypeDiagram;