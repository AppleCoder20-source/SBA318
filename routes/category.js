const express = require("express");
const router = express.Router();

const categories = require("../data/category");

router.get("/", (req, res) => {
  // Extract authid from query parameters
  const authidParam = req.query.authid;
  let filteredCategories;

  if (authidParam) {
    const checkid = Number(authidParam);

    filteredCategories = categories.filter((c) => c.authid === checkid);
    // If authid is 0, return the bad message
    if (checkid === 0) {
      return res.json({
        message: "It's bad and I don't like it",
        categories: filteredCategories,
      });
    }
  }
  // If no categories are found after filtering
  if (filteredCategories.length === 0) {
    return res.json({
      message: "No categories found with the provided criteria",
      categories: [],
    });
  }
  // Return the filtered categories with a good message
  return res.json({
    message: "Good message",
    categories: filteredCategories,
  });
});

module.exports = router;

//URLS to test link for this file 
//http://localhost:3000/category/?authid=1
//http://localhost:3000/category/?authid=0
