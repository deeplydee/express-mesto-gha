const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const { routes } = require('./routes');

const app = express();

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
}

main();

app.use((req, res, next) => {
  req.user = {
    _id: '6303b04d0b745fc3ab41cf6e',
  };

  next();
});

app.use(express.json());

app.use(routes);
