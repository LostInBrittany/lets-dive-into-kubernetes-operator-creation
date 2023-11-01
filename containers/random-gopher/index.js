import express from 'express';

import { readdir } from 'node:fs/promises';
import path  from 'node:path';

let app = express();
let chosenGopher;

async function initFiles() {
    try {
        const files = await readdir('gophers');
        const gophers = files.filter(
            (item) => item.endsWith('png') || item.endsWith('jpg')
        );
        const randomIndex = Math.floor((Math.random()*gophers.length));
        chosenGopher = gophers[randomIndex];
        console.log(chosenGopher);
      } catch (err) {
        console.error(err);
      } 
}

function sendGopher(req,res) {
    res.sendFile(
        `/gophers/${chosenGopher}`, { root : '.'}
    );
}


app.get('/', sendGopher);
app.get('/gopher', sendGopher);

app.get('/gopher/name', (req, res) => res.send(chosenGopher.split('.')[0]));


let server = app.listen(process.env.PORT || 8080, async function () {
    await initFiles();

    console.log(`gophers/${chosenGopher}`,  { root : path.dirname(import.meta.url)});

    let host = server.address().address;
    let port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
  });