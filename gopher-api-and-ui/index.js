import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import yaml from 'yaml';



const gophers=[];
const file  = fs.readFileSync('./swagger/swagger.yml', 'utf8')
const swaggerDocument = yaml.parse(file)

const genAPIKey = () => {
    //create a base-36 string that contains 30 chars in a-z,0-9
    return [...Array(30)]
      .map((e) => ((Math.random() * 36) | 0).toString(36))
      .join('');
  };

const authenticateKey = (req, res, next) => {
    let receivedApiKey = req.header("x-api-key"); 
    if (!receivedApiKey || receivedApiKey != apiKey) {
        //Reject request if API key doesn't match
        res.status(403).send({ error: { code: 403, message: "You not allowed." } });
        return;
    }
    next();
}

const apiKey = genAPIKey();
console.log('API key', apiKey);

let app = express();

app.use(express.json()) // for parsing application/json
app.use(cors());

app.use('/web', express.static('web'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/health', (req, resp) => {
    resp.send('OK');
});

app.get('/gophers', (req, resp) => {
    resp.send(gophers);
});

app.delete('/gophers',  authenticateKey, (req, resp) => {
    gophers.splice(0);
})

app.post('/gopher', authenticateKey, (req, resp) => {

    let gopher = req.body;

    if (!gopher || 
        !gopher.id || 
        !gopher.name || 
        !gopher.displayname || 
        !gopher.url) {
            resp.status(400).send('Received no Gopher object in request body');
            return;
    }

    if (gophers.find((item) => item.id == req.body['id'])) {
        resp.status(409).send('Gopher already exists');
        return;
    }

    gophers.push(gopher);
    resp.send(gopher);
});

app.get('/gopher', (req, resp) => {

    let gopher = gophers.find((item) => item.id == req.query['id']);

    if (!gopher) {
        resp.status(404).send(`A gopher with the specified id was not found.`);
        return;
    } 
    resp.send(gopher);  
});

app.delete('/gopher', authenticateKey, (req, resp) => {

    let gopherIndex = gophers.findIndex((item) => item.id == req.query['id']);

    console.log(gopherIndex);
    
    if (gopherIndex < 0) {
        resp.status(404).send(`A gopher with the specified id was not found.`);
        return;
    } 
    gophers.splice(gopherIndex, 1);
    resp.send('OK');  
});

app.put('/gopher', authenticateKey, (req, resp) => {


    let gopher = req.body;

    if (!gopher || 
        !gopher.id || 
        !gopher.name || 
        !gopher.displayname || 
        !gopher.url) {
            resp.status(400).send('Received no Gopher object in request body');
            return;
    }

    let gopherIndex = gophers.findIndex((item) => item.id == req.body['id']);

    if ( gopherIndex < 0) {
        resp.status(404).send('A gopher with the specified id was not found.');
        return;
    }
    
    gophers[gopherIndex] = gopher;
    resp.send(gopher);
});


let server = app.listen(process.env.PORT || 8080, async function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});