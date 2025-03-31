import express from 'express';
const app = express();

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

app.get('/api/v1/cat', (req, res) => {
  const cat = {
    cat_id: 246,
    name: 'Köpi',
    birthdate: '2024-09-12',
    weight: 4,
    owner: 'Ida',
    image: 'https://loremflickr.com/320/240/cat',
  };
  res.json(cat);
});

export default app;
