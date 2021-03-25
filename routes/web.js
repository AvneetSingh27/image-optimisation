const express = require("express");
const router = express.Router();
const homeController = require("./../controllers/home");
const uploadController = require("./../controllers/upload");


let routes = app => {
  router.get("/", homeController.getHome);

  //Resize
  router.post(
    "/upload",
    uploadController.uploadImage,
    uploadController.resizeImage,

  );

  //Conversion
  router.post("/convert",
    uploadController.uploadImage,
    uploadController.convertImage
  );
  
  //Get Colour Codes
  router.post("/getColorCodes",
    uploadController.uploadImage,
    uploadController.getColorCodes
  );

  return app.use("/", router);
};

module.exports = routes;