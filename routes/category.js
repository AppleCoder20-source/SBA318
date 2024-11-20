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
    if (checkid === 0) {
      return res.json({
        message: "Bad Category",
        categories: filteredCategories.map((c) => ({
          id: c.id,
          category: c.category,
          author: c.author,
        }))
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
    message: "Good Category",
    categories: filteredCategories.map((c) => ({
      id: c.id,
      category: c.category,
      author: c.author,
    })),
  });
});
module.exports = router;

//URLS to test link for this file 
//http://localhost:3000/category/?authid=1
//http://localhost:3000/category/?authid=0
