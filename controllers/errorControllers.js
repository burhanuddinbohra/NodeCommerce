exports.getError404 = (req, res) => {
  res.render("error-pages/errorNotFound", {
    pageTitle: "Error Page!",
    path: "",
  });

  // res.status(404).sendFile(path.join(__dirname,'views','error-pages','errorNotFound.html'))
};
