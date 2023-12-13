module.exports = function (app, shopData, db) {
  // Handle our routes
  app.get("/", function (req, res) {
    res.render("index.ejs", shopData);
  });

  app.get("/about", function (req, res) {
    res.render("about.ejs", shopData);
  });

  app.get("/register", function (req, res) {
    res.render("register.ejs", shopData);
  });

  app.get("/search", function (req, res) {
    res.render("search.ejs", shopData);
  });

  app.get("/topics", function (req, res) {
    let sqlQuery = "SELECT * FROM Topics";

    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.error(err.message);
        res.redirect("/");
      } else {
        let newData = Object.assign({}, shopData, { availableTopics: result });
        res.render("topics.ejs", newData);
      }
    });
  });

  app.get("/users", function (req, res) {
    let sqlQuery = "SELECT * FROM Users";
    db.query(sqlQuery, (err, result) => {
      if (err) {
        res.redirect("./");
      }

      let newData = Object.assign({}, shopData, { users: result });
      res.render("users.ejs", newData);
    });
  });

  app.get("/search-result", function (req, res) {
    // Get the search keyword from the request
    let keyword = req.query.keyword;

    // Basic search query
    let basicSearchQuery = "SELECT * FROM Topics WHERE name = ?";
    // Advanced search query
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
              // Combine the results and render the template
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

  // Display confirmation page for deleting a post
  app.get("/deleteposts/:id", function (req, res) {
    let postId = req.params.id;

    // Assuming you have a function to get post details by ID from the database
    // Modify this as per your actual database structure
    let sqlQuery = "SELECT * FROM Forum WHERE id = ?";
    db.query(sqlQuery, [postId], (err, result) => {
      if (err || result.length === 0) {
        res.redirect("/");
      } else {
        let postData = result[0];
        res.render("deleteposts.ejs", { post: postData });
      }
    });
  });

  app.get("/topicdetails/:id", function (req, res) {
    let topicId = req.params.id;

    // Assuming you have a function to get topic details and posts by ID from the database
    // Modify this as per your actual database structure
    let sqlQuery = "SELECT * FROM Topics WHERE id = ?";
    db.query(sqlQuery, [topicId], (err, topicResult) => {
      if (err || topicResult.length === 0) {
        res.redirect("/");
      } else {
        let topicData = topicResult[0];

        // Assuming you have a function to get posts for a specific topic from the database
        // Modify this as per your actual database structure
        let postsQuery = "SELECT * FROM Posts WHERE topic_id = ?";
        db.query(postsQuery, [topicId], (err, postsResult) => {
          if (err) {
            console.error(err.message);
            res.redirect("/");
          } else {
            let postsData = postsResult;

            // Render the topicdetails.ejs template with the topic and posts data
            res.render("topicdetails.ejs", {
              topic: topicData,
              posts: postsData,
            });
          }
        });
      }
    });
  });

  app.get("/listposts", function (req, res) {
    let sqlQuery = "SELECT * FROM Posts";
    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.error(err.message);
        res.redirect("/");
      } else {
        let data = {
          forumPosts: result,
          // You can add other data if needed
        };
        res.render("listposts.ejs", data);
      }
    });
  });

  app.get("/addposts", function (req, res) {
    res.render("addposts.ejs");
  });

  app.post("/postadded", function (req, res) {
    // saving the data in database
    let sqlquery =
      "INSERT INTO Posts (id,content, user_id, created_at) VALUES (?,?,?, NOW())";
    // executing sql query
    let newrecord = [req.body.id, req.body.content, req.body.user_id];
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        return console.error(err.message);
      } else {
        res.send(
          " This post is added to database, name: " +
            req.body.id +
            " content " +
            req.body.content +
            req.body.user_id
        );
      }
    });
  });
  // Handle the actual post deletion
  app.post("/deleteposts/:id", function (req, res) {
    let postId = req.params.id;

    // Assuming you have a function to delete a post by ID from the database
    // Modify this as per your actual database structure
    let sqlQuery = "DELETE FROM Forum WHERE id = ?";
    db.query(sqlQuery, [postId], (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
      } else {
        res.redirect("/");
      }
    });
  });

  app.post("/registered", function (req, res) {
    // Saving the data in the database
    res.send(
      "Hello " +
        req.body.first +
        " " +
        req.body.last +
        " you are now registered!  We will send an email to you at " +
        req.body.email
    );
  });
};
