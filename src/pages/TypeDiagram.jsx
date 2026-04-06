import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

function TypeDiagram({ pokemonLijst }) {
    const typeAantallen = {};

    // 1. Tellen van de types (blijft hetzelfde)
    pokemonLijst.forEach(pokemon => {
        pokemon.types.forEach(type => {
            const typNaam = type.type.name;
            typeAantallen[typNaam] = (typeAantallen[typNaam] || 0) + 1;
        });
    });

    // 2. Data voorbereiden voor Recharts
    const data = Object.entries(typeAantallen)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

    const TYPE_KLEUREN = {
        fire: '#FDDFDF', water: '#D8EEFF', grass: '#DBF5D0', electric: '#FFF5CC',
        psychic: '#FFD6EC', poison: '#EDD5FF', normal: '#F0EFE8', flying: '#E0EEFF',
        bug: '#E8F5D0', ground: '#F5E8C8', rock: '#EDE8D0', ice: '#D6F5F5',
        dragon: '#D5D0FF', ghost: '#D8D0EE', dark: '#D5D0C8', steel: '#E8E8F0',
        fairy: '#FFE0F0', fighting: '#ffd8c8',
    };

    return (
        <div className="diagram-sectie" style={{ width: '100%', height: 400 }}>
            <h2>Top 10 types</h2>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%" // Center X
                        cy="50%" // Center Y
                        outerRadius={100}
                        dataKey="value"
                    >
                        {data.map((entry) => (
                            <Cell 
                                key={`cell-${entry.name}`} 
                                fill={TYPE_KLEUREN[entry.name] || '#ccc'} 
                                stroke="#888"
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default TypeDiagram;