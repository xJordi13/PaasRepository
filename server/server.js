const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Rutas de la API
app.get('/api/games', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM videogames');
        res.json(result.rows); // Enviar los juegos con la URL de la imagen
    } catch (err) {
        console.error(err.message);
    }
});


// Agregar un nuevo juego
app.post('/api/games', async (req, res) => {
    try {
        const { title, genre, platform, release_date, price } = req.body;
        const result = await pool.query(
            'INSERT INTO videogames (title, genre, platform, release_date, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, genre, platform, release_date, price]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Ruta para manejar la compra de un videojuego
app.post('/api/purchase', async (req, res) => {
    const { game, name, email, address } = req.body;

    // Verificar que los datos recibidos estén correctos
    console.log("Received purchase data:", {
        game_title: game.title,
        game_price: game.price,
        buyer_name: name,
        buyer_email: email,
        buyer_address: address
    });

    try {
        // Insertar la compra en la base de datos
        const result = await pool.query(
            'INSERT INTO purchases (game_title, game_price, buyer_name, buyer_email, buyer_address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [game.title, game.price, name, email, address]
        );

        // Si la compra es exitosa, devolver la respuesta con el resultado
        console.log("Purchase inserted:", result.rows[0]);
        res.json({ success: true, purchase: result.rows[0] });
    } catch (err) {
        console.error("Error in inserting purchase:", err.message);
        res.json({ success: false, message: 'Error processing the purchase' });
    }
});




// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
