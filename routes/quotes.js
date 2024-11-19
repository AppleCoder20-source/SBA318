const express = require("express");
const router = express.Router();

const quotes = require("../data/quotes"); 
const error = require("../utilities/error"); // Import the error utility function

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
    const { id, quote, author, favorites } = req.body;

    if (!id || !quote || !author || !favorites) {
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
      quote,
      author,
      favorites,
    };

    quotes.push(newQuote);

    res.status(201).json({ message: "Quote created successfully", quote: newQuote });
  });

router
  .route("/:favorites/quotes")
  .get((req, res, next) => {
    const fav = req.params.favorites;

    if (fav !== "yes" && fav !== "no") {
      return next({
        status: 404,
        message: `No quotes found for favorites = '${fav}'. Please put 'yes' or 'no' in route.`,
      });
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

module.exports = router;
