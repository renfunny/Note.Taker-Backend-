const fb = require(`express`).Router();
const { readFromFile, readAndAppend } = require(`../helpers/fsUtils`);

fb.get(`/`, (req, res) => {
  readFromFile(`./db/db.json`).then((data) => res.json(JSON.parse(data)));
});

fb.post(`/`, (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
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

module.exports = fb;
