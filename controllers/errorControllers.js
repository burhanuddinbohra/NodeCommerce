exports.getError404 = (req, res) => {
  res.status(404).render("error-pages/errorNotFound", {
    pageTitle: "Error Page!",
    path: "",
  });
};

exports.getError500 = (req, res) => {
  res.status(500).render("error-pages/error500", {
    pageTitle: "Page Not Found",
    path: "",
  });
};
