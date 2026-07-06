// Busca un Pokémon en la PokeAPI por su nombre
async function buscarPokemon(nombre) {
    const nombreMinuscula = nombre.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${nombreMinuscula}`;

    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        console.log(`Error: no se encontró el Pokémon "${nombre}"`);
        console.log("Status:", respuesta.status);
        return null;
    }

    const datos = await respuesta.json();
    return datos;
}

// Muestra la ficha con los datos del Pokémon
function mostrarFicha(datos) {
    if (datos === null) {
        console.log("No hay información para mostrar.");
        return;
    }

    console.log("Nombre:", datos.name.toUpperCase());
    console.log("ID:", datos.id);

    const tipos = [];
    for (const tipo of datos.types) {
        tipos.push(tipo.type.name);
    }
    console.log("Tipos:", tipos.join(" / "));

    console.log("Altura:", datos.height * 10, "cm");
    console.log("Peso:", datos.weight / 10, "kg");

    console.log("Stats:");
    for (const stat of datos.stats) {
        console.log(`- ${stat.stat.name}: ${stat.base_stat}`);
    }

    console.log("Habilidades:");
    for (const habilidad of datos.abilities) {
        if (habilidad.is_hidden) {
            console.log(`- ${habilidad.ability.name} (oculta)`);
        } else {
            console.log(`- ${habilidad.ability.name}`);
        }
    }
}

// Devuelve el valor de una stat por su nombre
function obtenerStat(datos, nombreStat) {
    for (const stat of datos.stats) {
        if (stat.stat.name === nombreStat) {
            return stat.base_stat;
        }
    }
    return null;
}

// Compara dos Pokémon en una stat elegida
async function compararPokemon(nombre1, nombre2, stat) {
    const statMinuscula = stat.toLowerCase();

    const pokemon1 = await buscarPokemon(nombre1);
    const pokemon2 = await buscarPokemon(nombre2);

    if (pokemon1 === null || pokemon2 === null) {
        console.log("No se puede comparar porque uno de los Pokémon no existe.");
        return;
    }

    const valor1 = obtenerStat(pokemon1, statMinuscula);
    const valor2 = obtenerStat(pokemon2, statMinuscula);

    if (valor1 === null || valor2 === null) {
        console.log(`La stat "${stat}" no existe.`);
        console.log("Stats válidas: hp, attack, defense, special-attack, special-defense, speed");
        return;
    }

    console.log("----------------------");
    console.log(`Comparando ${pokemon1.name.toUpperCase()} vs ${pokemon2.name.toUpperCase()}`);
    console.log(`Stat elegida: ${statMinuscula}`);
    console.log(`${pokemon1.name}: ${valor1}`);
    console.log(`${pokemon2.name}: ${valor2}`);

    if (valor1 > valor2) {
        console.log(`Gana ${pokemon1.name.toUpperCase()} en ${statMinuscula}.`);
    } else if (valor2 > valor1) {
        console.log(`Gana ${pokemon2.name.toUpperCase()} en ${statMinuscula}.`);
    } else {
        console.log("Hay empate.");
    }
}

// Devuelve el Pokémon con la stat más alta de una lista
async function pokemonMasFuerte(listaNombres, stat) {
    const statMinuscula = stat.toLowerCase();

    let mejorNombre = null;
    let mejorValor = -1;

    for (const nombre of listaNombres) {
        const pokemon = await buscarPokemon(nombre);

        if (pokemon === null) {
            console.log(`Se salta "${nombre}" porque no existe.`);
            continue;
        }

        const valorStat = obtenerStat(pokemon, statMinuscula);

        if (valorStat === null) {
            console.log(`La stat "${stat}" no existe para ${nombre}.`);
            continue;
        }

        console.log(`${pokemon.name} tiene ${statMinuscula}: ${valorStat}`);

        if (valorStat > mejorValor) {
            mejorNombre = pokemon.name;
            mejorValor = valorStat;
        }
    }

    if (mejorNombre === null) {
        console.log("No se pudo encontrar un ganador.");
        return null;
    }

    console.log("----------------------");
    console.log(`El Pokémon más fuerte en ${statMinuscula} es ${mejorNombre.toUpperCase()} con ${mejorValor}.`);

    return mejorNombre;
}

// Desafío final
async function ejecutarDesafioFinal() {
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

    console.log("=== Comparación por ATTACK ===");
    const ganadorAttack = await pokemonMasFuerte(equipo, "attack");

    console.log("\n=== Comparación por DEFENSE ===");
    await pokemonMasFuerte(equipo, "defense");

    console.log("\n=== Ficha completa del ganador en ATTACK ===");
    if (ganadorAttack !== null) {
        const datosGanador = await buscarPokemon(ganadorAttack);
        mostrarFicha(datosGanador);
    }
}

ejecutarDesafioFinal();