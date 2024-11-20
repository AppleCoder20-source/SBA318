const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "ejs");

// Import Routes
const quotesRouter = require("./routes/quotes"); 
const catRouter = require("./routes/category");

// Middleware for parsing JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Use Routes
app.use("/quotes", quotesRouter); 
app.use("/category", catRouter);

// Root Endpoint with HATEOAS Links
app.get("/", (req, res) => {
  res.json({
    links: [
      {
        href: "/api",
        rel: "This is for Quotes",
        type: "GET",
      },
    ],
  });
});

// API Endpoint with HATEOAS Links
app.get("/api", (req, res) => {
  res.json({
    links: [
      {
        href: "/quotes",
        rel: "quotes",
        type: "GET",
      },
      {
        href: "/category",
        rel: "category",
        type: "GET",
      },
    ],
  });
});

// 404 Middleware
app.use((req, res, next) => {
  next(error(404, "Resource Not Found"));
});

// Error-handling middleware.
// Any call to next() that includes an
// Error() will skip regular middleware and
// only be processed by error-handling middleware.
// This changes our error handling throughout the application,
// but allows us to change the processing of ALL errors
// at once in a single location, which is important for
// scalability and maintainability.
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}.`);
});
