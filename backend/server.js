const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const { readFileSync, writeFileSync } = fs;

app.use(cors());
app.use(express.json());

app.get('/exercise/:id', async (req, res) => {
  const lesson = req.params.id;
  try {
    const exercises = await readFileSync(`./src/resources/exercises/${lesson}.json`);
    res.json(JSON.parse(exercises));    
  } catch (error) {
    res.json(JSON.parse([]));
  }
});

app.get('/vocabulary/:id', async (req, res) => {
  const lesson = req.params.id;
  try {
    const vocabulary = await readFileSync(`./src/resources/vocabulary/${lesson}.json`);
    res.json(JSON.parse(vocabulary));    
  } catch (error) {
    res.json(JSON.parse([]));    
  }
});

app.post('/exercise', async (req, res) => {
  const newItem = req.body;
  try {
    const lesson = newItem.id.split('.')[0];
    let exercises = await readFileSync(`./src/resources/exercises/${lesson}.json`);
    exercises = JSON.parse(exercises);
    const exists = exercises.find((e) => e.id === newItem.id);
    newItem.id = exists ? newItem.id : `${lesson}.${('0' + exercises.length).slice(-2)}`
    let newExercises = exists ? exercises.filter(e => e.id !== newItem.id) : exercises;
    newExercises.push(newItem);
    await writeFileSync(`./src/resources/exercises/${lesson}.json`, JSON.stringify(newExercises.sort((a,b) => a.id > b.id), null, 2));
    res.json({msg: 'OK'});    
  } catch (error) {
    res.json({msg: 'ERR'});
  }
});

app.post('/vocabulary', async (req, res) => {
  const newItem = req.body;
  try {    
    const lesson = newItem.id.split('.')[0];
    let vocabulary = await readFileSync(`./src/resources/vocabulary/${lesson}.json`);
    vocabulary = JSON.parse(vocabulary);
    const exists = vocabulary.find((e) => e.id === newItem.id);
    newItem.id = exists ? newItem.id : `${lesson}.${('0' + vocabulary.length).slice(-2)}`
    let newVocabulary = exists ? vocabulary.filter(e => e.id !== newItem.id) : vocabulary;
    newVocabulary.push(newItem);
    await writeFileSync(`./src/resources/vocabulary/${lesson}.json`, JSON.stringify(newVocabulary.sort((a,b) => a.id > b.id), null, 2));
    res.json({msg: 'OK'});
  } catch (error) {
    res.json({msg: 'ERR'});
  }
});

app.listen(8000, () => {
  console.log('CORS-enabled web server listening on port 8000')
});
