
const authJwt = require("../middlewares/authJwt");
const controller = require("../controllers/products.controller");

module.exports = function (app) {
    // set header
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
    //get all
  app.get("/api/products/getAllProduct", [authJwt.verifyToken], controller.getAllProduct);
    //get by id
  app.get("/api/products/getProductById", [authJwt.verifyToken],controller.getProductById);
    //create Product
  app.post("/api/products/createProduct", [authJwt.verifyToken],controller.createProduct);
    //delete Product
  app.post("/api/products/deleteProduct", [authJwt.verifyToken],controller.deleteProduct);
    //edit Product
  app.post("/api/products/editProduct", [authJwt.verifyToken],controller.editProduct);
}