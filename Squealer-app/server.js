const bodyParser = require('body-parser');
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const app = express();
const port = 8080; // Puoi cambiare la porta se necessario
const dbUrl = 'mongodb://root:example@localhost:27017';
const Url = 'mongodb://site222325:ooB6ahw2@mongo_site222325:27017';
const client = new MongoClient(dbUrl);
const dbName = 'my-mongo-container';
const schedule = require('node-schedule');


app.use(bodyParser.json({ limit: '10000mb' }));
app.use(bodyParser.urlencoded({ limit: '10000mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/squealer-app', express.static(path.join(__dirname, 'my-react-app/build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'accesso.html'));
});

/*Angular main page access*/
const angularDistPath = path.join(__dirname, 'SMM-angular/dist/smm-squealer');
app.use('/SMM', express.static(angularDistPath));
app.get('/SMM/*', (req, res) => {
    res.sendFile(path.join(angularDistPath, 'index.html'));
});


app.get('/moderator', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'moderator.html'));
});

app.get('/squealer-app/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'my-react-app/build', 'index.html'));
});

if (!client.connect()) {
  console.error('Errore nella connessione a MongoDB:', err);
  process.exit(1);
} else {
  console.log("Connesso correttamente al server MongoDB");
}

initializeCollections();

  const db = client.db(dbName);  
  const UsersCollection = db.collection('Users');
  const ListChannelsCollection = db.collection('ListChannels');
  const ListSquealsCollection = db.collection('ListSqueals');

app.get('/get-users', async (req, res) => {
  try {
    const users = await UsersCollection.find().toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send('Errore durante la lettura dei dati degli utenti');
  }
});

app.get('/get-user/:id', async (req, res) => {
  try {
      const id = req.params.id;
      let object;
      if(id!="1"){
        object = await UsersCollection.findOne({ _id: new ObjectId(id) });
        if (!object) {
            return res.status(404).send('Oggetto non trovato');
        }
      } else {
        object = {};
      }
      res.status(200).json(object);
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante la ricerca dell\'oggetto');
  }
});

app.post('/add-user', async (req, res) => {
  try {
      const result = await UsersCollection.insertOne(req.body);
      res.status(201).json(result);
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante l\'aggiunta del nuovo utente');
  }
});

app.put('/update-users', async (req, res) => {
  try {
    const updatedUsers = req.body;
    const operations = updatedUsers.map(user => {
      const _id = typeof user._id === 'string' ? new ObjectId(user._id) : user._id;

      const { _id: idToRemove, ...replacementData } = user;

      return {
        replaceOne: {
          filter: { _id: _id },
          replacement: replacementData, // Non include l'`_id` nel documento di sostituzione
          upsert: false // Crea un nuovo documento se nessuno corrisponde al filtro
        }
      };
    });
    await UsersCollection.bulkWrite(operations);
      const users = await UsersCollection.find().toArray();
      res.status(200).json(users);
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante l\'aggiornamento degli utenti');
  }
});

app.delete('/delete-user/:id', async (req, res) => {
  try {
    const idToDelete = req.params.id;
    if (!ObjectId.isValid(idToDelete)) {
      return res.status(400).send('ID non valido');
    }
    await UsersCollection.deleteOne({ _id: new ObjectId(idToDelete) });
      
      const listUsers = await UsersCollection.find().toArray();
    res.status(200).json(listUsers);
  } catch (error) {
    res.status(500).send('Errore durante la lettura dei dati della lista dei messaggi');
  }
});

app.delete('/delete-squeal/:id', async (req, res) => {
  try {
    const idToDelete = req.params.id;
    if (!ObjectId.isValid(idToDelete)) {
      return res.status(400).send('ID non valido');
    }
    await ListSquealsCollection.deleteOne({ _id: new ObjectId(idToDelete) });
      
      const listSqueals = await ListSquealsCollection.find().toArray();
    res.status(200).json(listSqueals);
  } catch (error) {
    res.status(500).send('Errore durante la lettura dei dati della lista dei messaggi');
  }
});

app.delete('/delete-channel/:id', async (req, res) => {
  try {
    const idToDelete = req.params.id;
    if (!ObjectId.isValid(idToDelete)) {
      return res.status(400).send('ID non valido');
    }
    await ListChannelsCollection.deleteOne({ _id: new ObjectId(idToDelete) });
      
      const listChannels = await ListChannelsCollection.find().toArray();
    res.status(200).json(listChannels);
  } catch (error) {
    res.status(500).send('Errore durante la lettura dei dati della lista dei messaggi');
  }
});

app.put('/delete-users', async (req, res) => {
  try {
    const updatedUsers = req.body;

    updatedUsers.forEach((user) => {
      delete user._id;
    });

    await UsersCollection.deleteMany({});

    if(updatedUsers.length!=0)
      await UsersCollection.insertMany(updatedUsers);
    
    const listUsers = await UsersCollection.find().toArray();
    res.status(200).json(listUsers);
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante l\'aggiornamento degli squeals');
  }
})

app.put('/update-user/:id', async (req, res) => {
  try {
      const id = req.params.id;
      const updates = req.body;

      const result = await UsersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updates }
      );

      if (result.modifiedCount === 0) {
          return res.status(404).send('Utente non trovato o nessun aggiornamento necessario');
      }

      res.status(200).json({ message: 'Utente aggiornato con successo' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante l\'aggiornamento dell\'utente' });
  }
});

app.get('/get-listSqueals', async (req, res) => {
  try {
    const listSqueals = await ListSquealsCollection.find().toArray();
    res.status(200).json(listSqueals);
  } catch (error) {
    res.status(500).send('Errore durante la lettura dei dati della lista dei messaggi');
  }
});


app.post('/add-squeal', async (req, res) => {
  try {
      await ListSquealsCollection.insertOne(req.body);
      const result = await ListSquealsCollection.find().toArray();
      res.status(201).json(result);
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante l\'aggiunta del nuovo squeal');
  }
});

app.put('/update-squeals', async (req, res) => {
  try {
      const updatedSqueals = req.body;
      const operations = updatedSqueals.map(squeal => {
        const _id = typeof squeal._id === 'string' ? new ObjectId(squeal._id) : squeal._id;
  
        const { _id: idToRemove, ...replacementData } = squeal;
  
        return {
          replaceOne: {
            filter: { _id: _id },
            replacement: replacementData,
            upsert: false
          }
        };
      });
      await ListSquealsCollection.bulkWrite(operations);
      const listSqueals = await ListSquealsCollection.find().toArray();
    res.status(200).json(listSqueals);
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante l\'aggiornamento degli squeals');
  }
});

app.delete('/delete-all-squeals', async (req, res) => {
  try {
    await ListSquealsCollection.deleteMany({});
    res.status(200).send('Tutti gli Squeals sono stati cancellati');
  } catch (error) {
    res.status(500).send('Errore durante la cancellazione di tutti gli Squeals');
  }
});

app.put('/update-squeal/:id', async (req, res) => {
  try {
      const id = req.params.id;
      const updates = req.body;

      const result = await ListSquealsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updates }
      );
      if (result.modifiedCount === 0) {
          return res.status(404).send('Squeal non trovato o nessun aggiornamento necessario');
      }

      res.status(200).send('Squeal aggiornato con successo');
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante l\'aggiornamento dello Squeal');
  }
});


app.get('/get-listChannels', async (req, res) => {
  try {
    const listChannels = await ListChannelsCollection.find().toArray();
    res.status(200).json(listChannels);
  } catch (error) {
    res.status(500).send('Errore durante la lettura dei dati della lista dei canali');
  }
});

app.post('/add-channel', async (req, res) => {
  try {
      await ListChannelsCollection.insertOne(req.body);
      const result = await ListChannelsCollection.find().toArray();
      res.status(201).json(result);
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante l\'aggiunta del nuovo canale');
  }
});

app.put('/update-channels', async (req, res) => {
  try {
      const updatedChannels = req.body;
      const operations = updatedChannels.map(channel => {
        const _id = typeof channel._id === 'string' ? new ObjectId(channel._id) : channel._id;
  
        const { _id: idToRemove, ...replacementData } = user;
  
        return {
          replaceOne: {
            filter: { _id: _id },
            replacement: replacementData,
            upsert: false
          }
        };
      });
      await ListChannelsCollection.bulkWrite(operations);
      const listChannels = await ListChannelsCollection.find().toArray();
    res.status(200).json(listChannels);
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante l\'aggiornamento dei canali');
  }
});


app.put('/update-channel/:id', async (req, res) => {
  try {
      const id = req.params.id;
      const updates = req.body;

      const objectId = new ObjectId(id);

      const result = await ListChannelsCollection.updateOne(
        { _id: objectId },
        { $set: updates }
    );

    if (result.modifiedCount === 0) {
      console.log(`Canale non trovato con ID: ${id}`);
      return res.status(404).send('Canale non trovato o nessun aggiornamento necessario');
    }
  
  

      res.status(200).json({ message: 'Canale aggiornato con successo' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante l\'aggiornamento del canale' });
  }
});

async function initializeCollections() {
  try {
    await client.connect();

    const db = client.db(dbName);

    const collections1 = await db.listCollections({ name: 'ListChannels' }).toArray();
    if (collections1.length === 0) {
      const listChannelsCollection = await db.createCollection('ListChannels');
      console.log("Collezione 'ListChannels' creata");
    } else {
      console.log("La collezione 'ListChannels' esiste già");
    }

    const collections2 = await db.listCollections({ name: 'ListSqueals' }).toArray();
    if (collections2.length === 0) {
      const listSquealsCollection = await db.createCollection('ListSqueals');
      console.log("Collezione 'ListSqueals' creata");
    } else {
      console.log("La collezione 'ListSqueals' esiste già");
    }

    const collections3 = await db.listCollections({ name: 'Users' }).toArray();
    if (collections3.length === 0) {
        const usersCollection = await db.createCollection('Users');
        console.log("Collezione 'Users' creata");

        const usersToInsert = {
            nickname: "Jack",
            photoprofile: "",
            fullname: "Giacomo Fornaciari",
            email: "giacomo.fornaciari@studio.unibo.it",
            cell: "3333122042",      
            password: "Fenice13!",
            version: "moderator",
            blocked: false,
            popularity: 0,
            clients:[],
            char_d: 300,
            char_w: 2000,
            char_m: 7000,
            bio: "",
            photoprofileX: 0,
            photoprofileY: 0,
            notifications: [true, true, true, true]
        };

        // Inserisci l'elemento nella collezione
        await usersCollection.insertOne(usersToInsert);
        console.log("Utente iniziale inserito nella collezione 'Users'");
    } else {
      console.log("La collezione 'Users' esiste già");
    }

  } catch (err) {
      console.error(err);
  }
}

schedule.scheduleJob('0 0 * * *', async () => {
  const usersArray = await UsersCollection.find({}).toArray();
  for (let i=0; i<usersArray.length; i++){
    switch(usersArray[i].version){
      case 'moderator':
        usersArray[i].char_d = 1000;
      break;
      case 'normal':
        usersArray[i].char_d = 300;
      break;
      case 'verified':
        usersArray[i].char_d = 600;
      break;
      case 'professional':
        usersArray[i].char_d = 1000;
      break;
      case 'SMM':
        usersArray[i].char_d = 0;
      break;
    }
  }
  await UsersCollection.deleteMany({});
  await UsersCollection.insertMany(usersArray);
});

schedule.scheduleJob('0 0 * * 1', async () => {
  const usersArray = await UsersCollection.find({}).toArray();
  for (let i=0; i<usersArray.length; i++){
    switch(usersArray[i].version){
      case 'moderator':
        usersArray[i].char_w = 6500;
      break;
      case 'normal':
        usersArray[i].char_w = 2000;
      break;
      case 'verified':
        usersArray[i].char_w = 4000;
      break;
      case 'professional':
        usersArray[i].char_w = 6500;
      break;
      case 'SMM':
        usersArray[i].char_w = 0;
      break;
    }
  }
  await UsersCollection.deleteMany({});
  await UsersCollection.insertMany(usersArray);
});

schedule.scheduleJob('0 0 1 * *', async () => {
  const usersArray = await UsersCollection.find({}).toArray();
  for (let i=0; i<usersArray.length; i++){
    switch(usersArray[i].version){
      case 'moderator':
        usersArray[i].char_m = 23000;
      break;
      case 'normal':
        usersArray[i].char_m = 7000;
      break;
      case 'verified':
        usersArray[i].char_m = 14000;
      break;
      case 'professional':
        usersArray[i].char_m = 23000;
      break;
      case 'SMM':
        usersArray[i].char_m = 0;
      break;
    }
  }
  await UsersCollection.deleteMany({});
  await UsersCollection.insertMany(usersArray);
});

app.listen(port, () => {
  console.log(`Server in esecuzione su https://site222325.tw.cs.unibo.it`);
});