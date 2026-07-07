// Busca un Pokémon en la PokeAPI
async function buscarPokemon(nombre) {
    const nombreApi = nombre.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${nombreApi}`;

    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        console.log(`No se encontró el Pokémon "${nombre}".`);
        console.log("Status:", respuesta.status);
        return null;
    }

    return await respuesta.json();
}

// Muestra la ficha del Pokémon
function mostrarFicha(pokemon) {
    if (pokemon === null) {
        console.log("No hay información para mostrar.");
        return;
    }

    console.log("Nombre:", pokemon.name.toUpperCase());
    console.log("ID:", pokemon.id);

    const tipos = [];

    for (const tipo of pokemon.types) {
        tipos.push(tipo.type.name);
    }

    console.log("Tipos:", tipos.join(" / "));
    console.log("Altura:", pokemon.height * 10, "cm");
    console.log("Peso:", pokemon.weight / 10, "kg");

    console.log("Stats:");
    for (const stat of pokemon.stats) {
        console.log(`- ${stat.stat.name}: ${stat.base_stat}`);
    }

    console.log("Habilidades:");
    for (const habilidad of pokemon.abilities) {
        if (habilidad.is_hidden) {
            console.log(`- ${habilidad.ability.name} (oculta)`);
        } else {
            console.log(`- ${habilidad.ability.name}`);
        }
    }
}

// Obtiene el valor de una stat
function obtenerStat(pokemon, statBuscada) {
    for (const stat of pokemon.stats) {
        if (stat.stat.name === statBuscada) {
            return stat.base_stat;
        }
    }

    return null;
}

// Compara dos Pokémon usando una stat
async function compararPokemon(nombre1, nombre2, stat) {
    const statApi = stat.toLowerCase();

    const pokemon1 = await buscarPokemon(nombre1);
    const pokemon2 = await buscarPokemon(nombre2);

    if (pokemon1 === null || pokemon2 === null) {
        console.log("No se puede comparar porque uno de los Pokémon no existe.");
        return;
    }

    const valor1 = obtenerStat(pokemon1, statApi);
    const valor2 = obtenerStat(pokemon2, statApi);

    if (valor1 === null || valor2 === null) {
        console.log(`La stat "${stat}" no existe.`);
        console.log("Stats válidas: hp, attack, defense, special-attack, special-defense, speed");
        return;
    }

    console.log("Comparando", pokemon1.name.toUpperCase(), "vs", pokemon2.name.toUpperCase());
    console.log("Stat:", statApi);
    console.log(pokemon1.name + ":", valor1);
    console.log(pokemon2.name + ":", valor2);

    if (valor1 > valor2) {
        console.log("Gana", pokemon1.name.toUpperCase());
    } else if (valor2 > valor1) {
        console.log("Gana", pokemon2.name.toUpperCase());
    } else {
        console.log("Hay empate.");
    }
}

// Encuentra el Pokémon con mayor valor en una stat
async function pokemonMasFuerte(nombres, stat) {
    const statApi = stat.toLowerCase();

    let ganador = null;
    let mayorValor = -1;

    for (const nombre of nombres) {
        const pokemon = await buscarPokemon(nombre);

        if (pokemon === null) {
            console.log(`Se salta "${nombre}" porque no existe.`);
            continue;
        }

        const valor = obtenerStat(pokemon, statApi);

        if (valor === null) {
            console.log(`La stat "${stat}" no existe.`);
            return null;
        }

        console.log(pokemon.name + " tiene " + statApi + ":", valor);

        if (valor > mayorValor) {
            ganador = pokemon.name;
            mayorValor = valor;
        }
    }

    if (ganador === null) {
        console.log("No se pudo encontrar un ganador.");
        return null;
    }

    console.log("Ganador en", statApi + ":", ganador.toUpperCase(), "con", mayorValor);

    return ganador;
}

// Pruebas 
async function correrPruebas() {
    await compararPokemon("snorlax", "machamp", "attack");
    await compararPokemon("eevee", "gengar", "defense");
    await compararPokemon("snorlax", "machamp", "fuerza");

    const equipo = [
        "snorlax",
        "machamp",
        "gengar",
        "lucario",
        "charizard",
        "dragonite"
    ];

    console.log("Ataque:");
    const ganadorAtaque = await pokemonMasFuerte(equipo, "attack");

    console.log("Defensa:");
    await pokemonMasFuerte(equipo, "defense");

    console.log("Ficha del ganador:");
    if (ganadorAtaque !== null) {
        const pokemonGanador = await buscarPokemon(ganadorAtaque);
        mostrarFicha(pokemonGanador);
    }
}

// Inicio del programa
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 3) {
        await compararPokemon(args[0], args[1], args[2]);
        return;
    }

    await correrPruebas();
}

main();