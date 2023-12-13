// Exporting a function that handles routes using Express, shop data, and a database connection
module.exports = function (app, shopData, db) {
  // Route: Home Page
  app.get("/", function (req, res) {
    res.render("index.ejs", shopData);
  });

  // Route: About Page
  app.get("/about", function (req, res) {
    res.render("about.ejs", shopData);
  });

  // Route: Registration Page
  app.get("/register", function (req, res) {
    res.render("register.ejs", shopData);
  });

  // Route: Search Page
  app.get("/search", function (req, res) {
    res.render("search.ejs", shopData);
  });

  // Route: Topics Page
  app.get("/topics", function (req, res) {
    // Fetch topics from the database
    let sqlQuery = "SELECT * FROM Topics";
    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.error(err.message);
        res.redirect("/");
      } else {
        // Combine topics data with shop data and render the topics page
        let newData = Object.assign({}, shopData, { availableTopics: result });
        res.render("topics.ejs", newData);
      }
    });
  });

  // Route: Users Page
  app.get("/users", function (req, res) {
    // Fetch users from the database
    let sqlQuery = "SELECT * FROM Users";
    db.query(sqlQuery, (err, result) => {
      if (err) {
        res.redirect("./");
      }

      // Combine users data with shop data and render the users page
      let newData = Object.assign({}, shopData, { users: result });
      res.render("users.ejs", newData);
    });
  });

  // Route: Search Result Page
  app.get("/search-result", function (req, res) {
    // Get the search keyword from the request
    let keyword = req.query.keyword;

    // Basic and Advanced search queries
    let basicSearchQuery = "SELECT * FROM Topics WHERE name = ?";
    let advancedSearchQuery = "SELECT * FROM Topics WHERE name LIKE ?";

    // Execute basic search
    db.query(basicSearchQuery, [keyword], (err, basicResult) => {
      if (err) {
        console.error(err.message);
        res.redirect("/");
      } else {
        // Execute advanced search
        db.query(
          advancedSearchQuery,
          ["%" + keyword + "%"],
          (err, advancedResult) => {
            if (err) {
              console.error(err.message);
              res.redirect("/");
            } else {
              // Combine search results and render the search result page
              let shopDataData = {
                shopData: shopData,
                searchKeyword: keyword,
                basicSearchResult: basicResult,
                advancedSearchResult: advancedResult,
              };
              res.render("search-result.ejs", shopDataData);
            }
          }
        );
      }
    });
  });

  // Route: List Posts Page
  app.get("/listposts", function (req, res) {
    // Fetch all posts from the database
    let sqlQuery = "SELECT * FROM Posts";
    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.error(err.message);
        res.redirect("/");
      } else {
        // Combine post data and render the list posts page
        let data = {
          forumPosts: result,
          // You can add other data if needed
        };
        res.render("listposts.ejs", data);
      }
    });
  });

  // Route: Add Posts Page
  app.get("/addposts", function (req, res) {
    res.render("addposts.ejs");
  });

  // Route: Handle Post Addition
  app.post("/postadded", function (req, res) {
    // Save post data in the database
    let sqlquery =
      "INSERT INTO Posts (id,content, user_id, created_at) VALUES (?,?,?, NOW())";
    // Execute SQL query
    let newrecord = [req.body.id, req.body.content, req.body.user_id];
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        return console.error(err.message);
      } else {
        // Send a response indicating successful post addition
        res.send(
          " This post is added to the database, name: " +
            req.body.id +
            " content " +
            req.body.content +
            req.body.user_id
        );
      }
    });
  });

  // Route: Handle User Registration
  app.post("/registered", function (req, res) {
    // Save user registration data in the database
    let sqlquery =
      "INSERT INTO Users (id, username, email, password) VALUES (?,?,?, '123')";
    // Execute SQL query
    let newrecord = [req.body.id, req.body.username, req.body.email];
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        return console.error(err.message);
      } else {
        // Send a response indicating successful user registration
        res.send(
          " Hello " +
            req.body.id +
            " " +
            req.body.username +
            " you are now registered! We will send an email to you at " +
            req.body.email +
            ", with your " +
            req.body.password
        );
      }
    });
  });
};
