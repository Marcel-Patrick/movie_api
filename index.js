// to require express
const express = require("express");
const morgan = require("morgan");
const app = express();

// Express GET route about my top 10 movies
let moviesList = [
  {
    title: "The Shawshank Redemption",
    genre: ["Drama"],
    director: {
      name: "Frank Darabont",
      bio: "Frank Darabont was born in a refugee camp in 1959 in Montbeliard",
      birthYear: 1959,
      deathYear: "still alive",
    },
    imgURL: "https://www.imdb.com/title/tt0111161/mediaviewer/rm10105600/",
    released: 1994,
  },
  {
    title: "The Godfather",
    genre: ["Crime", "Drama"],
    director: {
      name: "Francis Ford Coppola",
      bio: "Francis Ford Coppola was born in 1939 in Detroit",
      birthYear: 1939,
      deathYear: "still alive",
    },
    imgURL: "https://www.imdb.com/title/tt0068646/mediaviewer/rm746868224/",
    released: 1972,
  },
  {
    title: "The Godfather: Part II",
    genre: ["Crime", "Drama"],
    director: {
      name: "Francis Ford Coppola",
      bio: "Francis Ford Coppola was born in 1939 in Detroit",
      birthYear: 1939,
      deathYear: "still alive",
    },
    imgURL: "https://www.imdb.com/title/tt0071562/mediaviewer/rm4159262464/",
    released: 1974,
  },
  {
    title: "The Dark Knight",
    genre: ["Action", "Crime", "Drama"],
    director: {
      name: "Christopher Nolan",
      bio: "Christopher Nolan was born on July 30, 1970, in London, England.",
      birthYear: 1970,
      deathYear: "still alive",
    },
    imgURL: "https://www.imdb.com/title/tt0468569/mediaviewer/rm4023877632/",
    released: 2008,
  },
  {
    title: "12 Angry Men",
    genre: ["Crime", "Drama"],
    director: {
      name: "Sidney Lumet",
      bio: "Sidney Lumet was a master of cinema, best known for his technical knowledge and his skill at getting first-rate performances from his actors.",
      birthYear: 1924,
      deathYear: 2011,
    },
    imgURL: "https://www.imdb.com/title/tt0050083/mediaviewer/rm2927108352/",
    released: 1957,
  },
  {
    title: "Schindler's List",
    genre: ["Biography", "Drama", "History"],
    director: {
      name: "Steven Spielberg",
      bio: "One of the most influential personalities in the history of cinema, Steven Spielberg is Hollywood's best known director and one of the wealthiest filmmakers in the world.",
      birthYear: 1946,
      deathYear: "still alive",
    },
    imgURL: "https://www.imdb.com/title/tt0108052/mediaviewer/rm1610023168/",
    released: 1993,
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    genre: ["Action", "Adventure", "Drama"],
    director: {
      name: "Peter Jackson",
      bio: "Sir Peter Jackson made history with The Lord of the Rings trilogy, becoming the first person to direct three major feature films simultaneously.",
      birthYear: 1961,
      deathYear: "still alive",
    },
    imgURL: "https://www.imdb.com/title/tt0167260/mediaviewer/rm584928512/",
    released: 2003,
  },
  {
    title: "Pulp Fiction",
    genre: ["Crime", "Drama"],
    director: {
      name: "Quentin Tarantino",
      bio: "Quentin Jerome Tarantino was born in Knoxville, Tennessee. His father, Tony Tarantino, is an Italian-American actor and musician from New Yor",
      birthYear: 1963,
      deathYear: "still alive",
    },
    imgURL:
      "https://www.imdb.com/title/tt0110912/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=9703a62d-b88a-4e30-ae12-90fcafafa3fc&pf_rd_r=1YW6DWD4454GM2M4V7SS&pf_rd_s=center-1&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_tt_8",
    released: 1994,
  },
  {
    title: "The Good, the Bad and the UglyI",
    genre: ["Adventure", "Western"],
    director: {
      name: "Sergio Leone",
      bio: "Sergio Leone was virtually born into the cinema - he was the son of Roberto Roberti (A.K.A. Vincenzo Leone), one of Italy's cinema pioneers, and actress Bice Valerian.",
      birthYear: 1929,
      deathYear: 1989,
    },
    imgURL: "https://www.imdb.com/title/tt0060196/mediaviewer/rm3188773120/",
    released: 1966,
  },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    genre: ["Action", "Adventure", "Drama"],
    director: {
      name: "Peter Jackson",
      bio: "Sir Peter Jackson made history with The Lord of the Rings trilogy, becoming the first person to direct three major feature films simultaneously.",
      birthYear: 1961,
      deathYear: "still alive",
    },
    imgURL: "https://www.imdb.com/title/tt0120737/mediaviewer/rm3592958976/",
    released: 2001,
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

// GET welcome message
app.get("/", (req, res) => {
  res.send("Welcome on my Top 10 Movies list!");
});

//GET list of all movies
app.get("/movies", (req, res) => {
  res.status(200).json(moviesList);
});

//GET data about a single movie
app.get("/movies/:title", (req, res) => {
  res.json(
    moviesList.find((movie) => {
      return movie.title === req.params.title;
    })
  );
});

//GET data about a movie genre
app.get("/movies/:title/genre", (req, res) => {
  res.send("Successful GET request returning data about a movie genre");
});

//GET data about a movie director
app.get("/movies/:title/director", (req, res) => {
  res.send("Successful GET request returning data about a movie director");
});

//Create new user accourt
app.post("/registration", (req, res) => {
  res.send("Successful POST request create new user accourt");
});

//Allow users to update their user information
app.put("/log_in/:userID/:userName", (req, res) => {
  res.send(
    "Successful PUT request allow users to update their user information"
  );
});

//Allow users to add a movie to their list of favorites
app.patch("/log_in/:userID/movies/favoritList/:title", (req, res) => {
  res.send(
    "Successful PATCH request Allow users to add a movie to their list of favorites"
  );
});

//Allow users to remove a movie from their list of favorites
app.delete("/log_in/:userID/movies/favoritList/:title", (req, res) => {
  res.send(
    "Successful DELETE request allow users to remove a movie from their list of favorites"
  );
});

//Allow existing users to deregister
app.delete("/deregistrate/:userID", (req, res) => {
  res.send("Successful DELETE request allow existing users to deregister");
});

// error handling
app.use(errorHandling);

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
