// to require express
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();

//to require mongoose
const mongoose = require("mongoose");
const Models = require("./models.js");

//to get access to movies and users model
const Movies = Models.Movie;
const Users = Models.User;

//This allows Mongoose to connect to movie_api database so it can perform CRUD operations
mongoose.connect("mongodb://localhost:27017/movie_apiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// define error handling function
let errorHandling = (req, res, next) => {
  res.status(404).send("Sorry but the requested page does not exist!");
};

//  log all requests
app.use(morgan("common"));

// serving static files, located in public directory
app.use(express.static("public"));

// using bodyParser
app.use(bodyParser.json());

// GET welcome message
app.get("/", (req, res) => {
  res.send("Welcome on my Top 10 Movies list!");
});

//GET list of all movies
app.get("/movies", (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//GET data about a single movie
app.get("/movies/:title", (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//GET data about a genre (description) by name/title (e.g., “Drama”)
app.get("/genres/:genre", (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.genre })
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//GET data about a director (bio, birth year, death year) by name
app.get("/director/:directorName", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.directorName })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Create new user accourt
app.post("/registration", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + " is already existing");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Get all users
app.get("/users", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get a user by username
app.get("/users/:username", (req, res) => {
  Users.findOne({ Username: req.params.username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Allow users to update their user information
app.put("/users/:username", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.username },
    {
      $set: {
        Username: req.body.username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//Allow users to add a movie to their list of favorites
app.post("/users/:username/FavoriteMovies/:movieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.username },
    {
      $push: { FavoriteMovies: req.params.movieID },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//Allow users to remove a movie from their list of favorites
app.delete("/users/:username/FavoriteMovies/:movieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.username },
    {
      $pull: { FavoriteMovies: req.params.movieID },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//Allow existing users to deregister
app.delete("/deregistrate/:username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + " does not exist");
      } else {
        res.status(200).send(req.params.username + " successfully deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// error handling
app.use(errorHandling);

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
