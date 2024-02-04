const express = require('express');
const db = require('./db/config');

const app = express();
const port = 3000;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });

app.use(express.json());

// Get all restaurants

app.get('/api/restaurants', async (req, res) => {
  try {
    const results = await db.query('SELECT * FROM restaurants');
    res.status(200).json({
      status: 'success',
      data: {
        restaurants: results.rows,
      },
    });
  } catch (err) {
    console.error(err);
  }
});

// Create a new restaurant

app.post('/api/restaurants', async (req, res) => {
    const { name, location, cuisine } = req.body;
    try {
        const result = await db.query(
          'INSERT INTO restaurants (name, location, cuisine) VALUES ($1, $2, $3) RETURNING *;',
          [name, location, cuisine]
        );
        res.status(201).json({
          status: 'success',
          data: {
            restaurant: result.rows[0],
          },
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          status: 'error',
          message: 'An error occurred while inserting the restaurant',
        });
      }
    });

// Retrieve the details of a restuarant by it's ID

    app.get('/api/restaurants/:id', async (req, res) => {
        const { id } = req.params;
        try {
          const result = await db.query('SELECT * FROM restaurants WHERE id = $1', [id]);
          
          if (result.rows.length === 0) {
            // No restaurant found with the given ID
            return res.status(404).json({
              status: 'fail',
              message: 'Restaurant does not exist',
            });
          }
          
          res.status(200).json({
            status: 'success',
            data: {
              restaurant: result.rows[0],
            },
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({
            status: 'error',
            message: 'An error occurred while retrieving the restaurant',
          });
        }
      });


// update the details of an existing restaurant
      app.put('/api/restaurants/:id', async (req, res) => {
        const { id } = req.params;
        const { name, location, cuisine } = req.body;
        try {
          const result = await db.query(
            'UPDATE restaurants SET name = $1, location = $2, cuisine = $3 WHERE id = $4 RETURNING *;',
            [name, location, cuisine, id]
          );
          res.status(200).json({
            status: 'success',
            data: {
              restaurant: result.rows[0],
            },
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({
            status: 'error',
            message: 'An error occurred while updating the restaurant',
          });
        }
      });
      
      
// delete a restuarant from my data base
      app.delete('/api/restaurants/:id', async (req, res) => {
        const { id } = req.params;
        try {
          await db.query('DELETE FROM restaurants WHERE id = $1', [id]);
          res.status(204).json({
            status: 'success',
            data: null,
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({
            status: 'error',
            message: 'An error occurred while deleting the restaurant',
          });
        }
      });



