// to require express, express-validator, morgan, body parser & CORS
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const { check, validationResult } = require("express-validator");

//to require mongoose
const mongoose = require("mongoose");
const Models = require("./models.js");

//to get access to movies and users model
const Movies = Models.Movie;
const Users = Models.User;

//This allows Mongoose to connect to movie_api database LOCALLY so it can perform CRUD operations
/*mongoose.connect("mongodb://localhost:27017/movie_apiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});*/

//This allows Mongoose to connect to movie_api database REMOTELY so it can perform CRUD operations
mongoose.connect(process.env.CONNECTION_URI, {
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
/* body-parser needs to come before other middlewares. If this isn't set up in the correct place, 
client applications will get 401 error, because credentials would not be readable by the server. */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// using CORS and allowing all domains to make requests
app.use(cors());

/* Allow only the listed origin */
/* let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234','https://fathomless-plains-90381.herokuapp.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));*/

// using auth.js
let auth = require("./auth.js")(app);

// using passport.js
/* Passport checks the authorization headers for my requests. This needs to come after body-parser
or else client apps will get 401 responses. */
const passport = require("passport");
require("./passport.js");

// endpoint for home page and GET welcome message
app.get("/", (req, res) => {
  res.send("Welcome to your Movies APP!");
});

/**
 * GET list of all movies
 * @description Endpoint to get data for all movies.<br>
 * Requires authorization JWT.
 * @method GETAllMovies
 * @param {string} endpoint - /movies
 * @param {req.headers} object - headers object containing the JWT formatted as below:<br>
 * { "Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object containing data for all movies. Refer to the
 *   Genre: { Name: <string>, Description: <string> },
 *   Director: { Name: <string>, Bio: <string>, Birth: <string>, Death: <string> },
 *   _id: <string>,
 *   Title: <string>,
 *   Description: <string>,
 *   Featured: <boolean>,
 *   ImagePath: <string> (example: "silenceOfTheLamps.png"),
 * ]}
 */
app.get("/movies", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/**
 * GET data about a single movie
 *  @description Endpoint to get data for one movie by title.<br>
 * Requires authorization JWT.
 * @method GETOneMovie
 * @param {string} endpoint - /movies/:title
 * @param {req.headers} object - headers object containing the JWT formatted as below:<br>
 * { "Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object containing data for one movie.
 * {
 *   Genre: { Name: <string>, Description: <string> },
 *   Director: { Name: <string>, Bio: <string>, Birth: <string>, Death: <string> },
 *   _id: <string>,
 *   Title: <string>,
 *   Description: <string>,
 *   Featured: <boolean>,
 *   ImagePath: <string> (example: "silenceOfTheLamps.png"),
 * }
 */
app.get("/movies/:title", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/**
 * GET data about a genre (description) by name/title (e.g., “Drama”)
 *  @description Endpoint to get info about a genre<br>
 * Requires authorization JWT.
 * @method GETOneGenre
 * @param {string} endpoint - /genres/:Genre
 * @param {req.headers} object - headers object containing the JWT formatted as below:<br>
 * { "Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object containing data for one genre.
 * { Name: <string>, Description: <string> }
 */
app.get("/genres/:genre", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.genre })
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/**
 * GET data about a director (bio, birth year, death year) by name
 * @description Endpoint to get info about a director<br>
 * Requires authorization JWT.
 * @method GETOneDirector
 * @param {string} endpoint - /directors/:Director
 * @param {req.headers} object - headers object containing the JWT formatted as below:<br>
 * { "Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object containing data for one director.
 * { Name: <string>, Bio: <string>, Birth: <string>, Death: <string> },
 */
app.get("/director/:directorName", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({ "Director.Name": req.params.directorName })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/**
 * Create new user accourt
 * @description Endpoint to add a new user<br>
 * Does not require authorization JWT.
 * @method POSTRegisterUser
 * @param {string} endpoint - /users/register
 * @param {req.body} object - The HTTP body must be a JSON object formatted as below (but Birthday is optional):<br>
 * {<br>
 * "Username": "johndoe",<br>
 * "Password": "aStrongPasWwOOrd",<br>
 * "Email" : "johndo@gmail.com",<br>
 * "Birthday" : "1995-08-24"<br>
 * }
 * @returns {object} - JSON object containing data for the new user.
 * { _id: <string>,
 *   Username: <string>,
 *   Password: <string> (hashed),
 *   Email: <string>,
 *   Birthday: <string>
 *   FavoriteMovies: []
 * }
 */
app.post(
  "/registration",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // is user already existeng?
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + " is already existing");
        } else {
          // is the user with this name not existing :
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
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
  }
);

/**
 * Get all users
 * @description Endpoint to get data for all users.<br>
 * Requires authorization JWT.
 * @method GETAllUsers
 * @param {string} endpoint - /users
 * @param {req.headers} object - headers object containing the JWT formatted as below:<br>
 * { "Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object containing data for all users.
 * {[  _id: <string>,
 *     Username: <string>,
 *     Password: <string> (hashed),
 *     Email: <string>,
 *     Birthday: <string>
 *     FavoriteMovies: [<string>]
 * ]}
 */
app.get("/users", passport.authenticate("jwt", { session: false }), (req, res) => {
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
app.get("/users/:username", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/**
 * Allow users to update their user information
 *@description Endpoint to update a user's data<br>
 * Requires authorization JWT.
 * @method PUTUpdateUser
 * @param {string} endpoint - /users/:Username
 * @param {req.headers} object - headers object containing the JWT formatted as below:<br>
 * { "Authorization" : "Bearer <jwt>"}
 * @param {req.body} object - The HTTP body must be a JSON object formatted as below (all fields optional):<br>
 * {<br>
 * "Username": "johndoe",<br>
 * "Password": "aStrongPasWwOOrd",<br>
 * "Email" : "johndo@gmail.com",<br>
 * "Birthday" : "1995-08-24"<br>
 * }
 * @returns {object} - JSON object containing updated user data.
 * { _id: <string>,
 *   Username: <string>,
 *   Password: <string> (hashed),
 *   Email: <string>,
 *   Birthday: <string>
 *   FavoriteMovies: [<string>]
 * }
 */
app.put(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
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
  }
);

/**
 * Allow users to add a movie to their list of favorites
 * @description Endpoint to add a movie to a user's favorites<br>
 * Requires authorization JWT.
 * @method POSTAddFavoriteMovie
 * @param {string} endpoint - /users/:Username/movies/:movieID
 * @param {req.headers} object - headers object containing the JWT formatted as below:<br>
 * { "Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object containing updated user data.
 * { _id: <string>,
 *   Username: <string>,
 *   Password: <string> (hashed),
 *   Email: <string>,
 *   Birthday: <string>
 *   FavoriteMovies: [<string>]
 * }
 */
app.post(
  "/users/:username/FavoriteMovies/:movieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

/**
 * Allow users to remove a movie from their list of favorites
 * @description Endpoint to remove a movie to a user's favorites<br>
 * Requires authorization JWT.
 * @method DELETERemoveFavoriteMovie
 * @param {string} endpoint - /users/:Username/movies/:movieID
 * @param {req.headers} object - headers object containing the JWT formatted as below:<br>
 * { "Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object containing updated user data.
 * { _id: <string>,
 *   Username: <string>,
 *   Password: <string> (hashed),
 *   Email: <string>,
 *   Birthday: <string>
 *   FavoriteMovies: [<string>]
 * }
 */
app.delete(
  "/users/:username/FavoriteMovies/:movieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

/**
 * Allow existing users to deregister
 * @description Endpoint to delete a user account<br>
 * Requires authorization JWT.
 * @method DELETEUserAccount
 * @param {string} endpoint - /deregistrate/:Username
 * @param {req.headers} object - headers object containing the JWT formatted as below:<br>
 * { "Authorization" : "Bearer <jwt>"}
 * @returns {string} - A string containing the message: "<Username> successfully deleted."
 */
app.delete(
  "/deregistrate/:username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

// error handling
app.use(errorHandling);

// listen for requests
/* app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});*/

// open server
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
