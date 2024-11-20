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
      return next(error(400, "ID, Quote, author, and favorites are required."));
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

    if (filteredQuotes.length === 0) {
      return res.status(404).json({ message: `No quotes found for favorites = '${fav}'.` });
    }

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

    // Find the index of the quote to delete
    const index = quotes.findIndex((quote) => quote.id === id);

    if (index !== -1) {
      const deletedQuote = quotes.splice(index, 1)[0];
      res.json({ message: "Quote deleted successfully", quote: deletedQuote });
    } else {
      next(error(404, `Quote with ID ${id} not found.`));
    }
  });

// EJS Routes 
// ---------------------------------------------

// Route to display quotes based on favorites using EJS
router.get("/ejs/:favorites", (req, res, next) => {
  const fav = req.params.favorites;

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
// link for delete:
// http://localhost:3000/quotes/del/3 this 3 can be any id number
