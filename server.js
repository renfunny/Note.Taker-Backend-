const express = require(`express`);
const path = require(`path`);
const { readFromFile, readAndAppend } = require(`./helpers/fsUtils`);
const fs = require(`fs`);
const uuid = require(`./helpers/uuid`);

const PORT = 5500;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(`public`));

//Routes
app.get(`/notes`, (req, res) => {
  console.log(`Note page requested`);
  res.sendFile(path.join(__dirname, `/public/notes.html`));
});

app.get(`/`, (req, res) => {
  console.log(`Home page requested`);
  res.sendFile(path.join(__dirname, `/public/index.html`));
});

//APIs
app.get(`/api/notes`, (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile(`./db/db.json`).then((data) => res.json(JSON.parse(data)));
});

app.post(`/api/notes`, (req, res) => {
  console.info(`${req.method} request received to add new note`);
  console.log(req.body);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, `./db/db.json`);

    const response = {
      status: `success`,
      body: newNote,
    };

    res.json(response);
  } else {
    res.json(`Error in saving new note`);
  }
});

app.delete("/api/notes/:id", (req, res) => {
  let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteId = req.params.id.toString();

  noteList = noteList.filter((selected) => {
    return selected.id != noteId;
  });

  fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
  res.json(noteList);
});

app.get(`/*`, (req, res) => {
  console.log(`Home page requested`);
  res.sendFile(path.join(__dirname, `/public/index.html`));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
