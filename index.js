// to require express
const express = require("express");
const morgan = require("morgan");
const app = express();

// Express GET route about my top 10 movies
let myTop10Movies = [
  {
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
  },
  {
    title: "The Godfather",
    director: "Francis Ford Coppola",
  },
  {
    title: "The Godfather: Part II",
    director: "Francis Ford Coppola",
  },
  {
    title: "The Dark Knight",
    director: "Christopher Nolan",
  },
  {
    title: "12 Angry Men",
    director: "Sidney Lumet",
  },
  {
    title: "Schindler's List",
    director: "Steven Spielberg",
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    director: "Peter Jackson",
  },
  {
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
  },
  {
    title: "The Good, the Bad and the UglyI",
    director: "Sergio Leone",
  },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    director: "Peter Jackson",
  },
];

// define error handling function
let errorHandling = (req, res, next) => {
  res.status(404).send("Sorry but the requested page does not exist!");
};

//  log all requests
app.use(morgan("common"));

// serving static files, located in public directory
app.use(express.static("public"));

// GET requests
app.get("/movies", (req, res) => {
  res.json(myTop10Movies);
});

app.get("/", (req, res) => {
  res.send("Welcome on my Top 10 Movies list! 3");
});

// error handling
app.use(errorHandling);

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
