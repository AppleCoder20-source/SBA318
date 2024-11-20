const express = require("express");
const router = express.Router();

const quotes = require("../data/quotes");
const error = require("../utilities/error");

router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "quotes/:id",
        rel: ":id",
        type: "GET",
      },
    ];
    res.json({ quotes, links });
  })
  .post((req, res, next) => {
    const { quote, author, favorites } = req.body;

    if (!quote || !author || !favorites) {
      return next(error(400, "Quote, author, and favorites are required."));
    }
    if (favorites !== "yes" && favorites !== "no") {
      return next(error(400, "Invalid Route. Please use 'yes' or 'no'."));
    }

    let newId;
    if (quotes.length > 0) {
      newId = quotes[quotes.length - 1].id + 1;
    } else {
      newId = 1;
    }
    const newQuote = {
      id: newId,
      quote: req.body.quote,
      author: req.body.author,
      favorites: req.body.favorites,
    };

    quotes.push(newQuote);
    res.status(201).json({ message: "Quote created successfully", quote: newQuote });
  });

router
  .route("/:favorites/quotes")
  .get((req, res, next) => {
    const fav = req.params.favorites;

    if (fav !== "yes" && fav !== "no") {
      return next(
        error(404, `No quotes found for favorites = '${fav}'. Please use 'yes' or 'no' in route.`)
      );
    }
    const filteredQuotes = quotes.filter((quote) => quote.favorites === fav);

    if (fav === "no") {
      return res.json({
        Dislike: "Bad Quote",
        quotes: filteredQuotes,
      });
    }
    res.json({
      favorites: fav,
      quotes: filteredQuotes,
    });
  });

router
  .route("/del/:id")
  .delete((req, res, next) => {
    const id = Number(req.params.id);

    const index = quotes.findIndex((quote) => quote.id === id);

    if (index !== -1) {
      const deletedQuote = quotes.splice(index, 1)[0];
      res.json({ message: "Quote deleted successfully", quote: deletedQuote });
    } else {
      next(error(404, `Quote with ID ${id} not found.`));
    }
  });
  
  router
  .route("/patch/:id") 
  .patch((req, res, next) => {
    const Authors = quotes.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          quotes[i][key] = req.body[key];
        }
        return true;
      }
    });
    if (Authors) res.json(Authors);
    else next();
  });
// EJS Routes 
// ---------------------------------------------

router.get("/ejs/quotes", (req, res, next) => {
  const fav = req.query.favorites;

  if (fav !== "yes" && fav !== "no") {
    return next(
      error(404, `No quotes found for favorites = '${fav}'. Please use 'yes' or 'no' in route.`)
    );
  }
  const filteredQuotes = quotes.filter((quote) => quote.favorites === fav);

  if (filteredQuotes.length === 0) {
    return res.render("categories", {
      title: fav === "yes" ? "Favorite Quotes" : "Disliked Quotes",
      quotes: [],
      message: `No quotes found for favorites = '${fav}'.`,
    });
  }

  res.render("categories", {
    title: fav === "yes" ? "Favorite Quotes" : "Disliked Quotes",
    quotes: filteredQuotes,
  });
});

// Route to display all quotes using EJS
router.get("/ejs", (req, res) => {
  res.render("categories", {
    title: "All Quotes",
    quotes: quotes,
  });
});

// Error-handling route for EJS
router.use((err, req, res, next) => {
  res.status(err.status || 500).render("error", { error: err.message });
});

module.exports = router;

//default link:
//http://localhost:3000/quotes (also default for POST requests)

//GET Links:
// http://localhost:3000/quotes/yes/quotes
// http://localhost:3000/quotes/no/quotes

//link for PATCH 
//http://localhost:3000/quotes/patch/:id


// link for delete:
// http://localhost:3000/quotes/del/:id this 3 can be any id number

//link for EJS
//http://localhost:3000/quotes/ejs

