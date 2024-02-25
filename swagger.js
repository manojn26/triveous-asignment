const swaggerJsDoc = require("swagger-jsdoc");

// Configuring Specifications For Swagger

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Triveous Swagger Documentation",
      version: "1.0.0",
    },
    server: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);
module.exports = swaggerSpec;
