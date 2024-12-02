// Selección de elementos
const gameList = document.getElementById('game-list');
const searchInput = document.getElementById('search-input');

// Obtener los juegos desde la API
let games = []; // Definir juegos aquí
async function fetchGames() {
    const response = await fetch('/api/games');
    games = await response.json();  // Guardamos los juegos en el array
    renderGames(games);             // Renderizamos los juegos
}

// Renderizar los juegos en la página
function renderGames(games) {
    gameList.innerHTML = ''; // Limpiar la lista antes de renderizar nuevos datos
    games.forEach(game => {
        const gameItem = document.createElement('div');
        gameItem.classList.add('game-item');

        gameItem.innerHTML = `
            <img src="${game.image_url}" alt="${game.title}">
            <h2>${game.title}</h2>
            <p>${game.genre} | ${game.platform}</p>
            <p>Release Date: ${new Date(game.release_date).toLocaleDateString()}</p>
            <p>$${game.price}</p>
            <button onclick="buyGame('${game.title}', ${game.price}, '${game.id}')">Buy Now</button>
        `;

        gameList.appendChild(gameItem);
    });
}

// Filtrar juegos según el texto de búsqueda
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase(); // Obtenemos lo que el usuario escribe
    const filteredGames = games.filter(game => 
        game.title.toLowerCase().includes(query) ||       // Filtrar por título
        game.genre.toLowerCase().includes(query) ||       // Filtrar por género
        game.platform.toLowerCase().includes(query)       // Filtrar por plataforma
    );
    renderGames(filteredGames);  // Volver a renderizar los juegos filtrados
});

// Mostrar formulario de compra solo cuando se presiona "Buy Now"
function buyGame(gameTitle, gamePrice, gameId) {
    // Evitar que se cree el formulario si ya existe
    if (document.getElementById('buyer-form')) {
        return; // Si ya hay un formulario de compra, no crear otro
    }

    // Crear el formulario solo cuando el usuario hace clic en el botón de compra
    const buyerForm = document.createElement('form');
    buyerForm.id = 'buyer-form';
    buyerForm.innerHTML = `
        <h3>Enter your details to buy ${gameTitle}</h3>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <label for="address">Address:</label>
        <textarea id="address" name="address" required></textarea>
        <button type="submit">Confirm Purchase</button>
        <button type="button" onclick="closeForm()">Close</button>
    `;

    // Insert the form into the body
    document.body.appendChild(buyerForm);

    // Manejar la acción de compra
    buyerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;

        const response = await fetch('/api/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                game: { title: gameTitle, price: gamePrice, id: gameId },
                name,
                email,
                address,
            }),
        });

        const data = await response.json();
        if (data.success) {
            alert('Purchase successful!');
        } else {
            alert('There was an error processing your purchase.');
        }

        // Eliminar el formulario después de la compra
        closeForm();
    });
}

// Cerrar el formulario sin realizar la compra
function closeForm() {
    const buyerForm = document.getElementById('buyer-form');
    if (buyerForm) {
        buyerForm.remove();
    }
}

// Inicializar la aplicación
fetchGames();  // Llamamos a la función para obtener y mostrar los juegos
