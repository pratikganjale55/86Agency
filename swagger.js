const swaggerjsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOption = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Your API",
      version: "1.0.0",
      description: "A sample API for testing Swagger",
    },
  },
  apis: [
    "./src/routes/users.js",
    "./src/routes/usersPost.js",
    "./src/routes/userProcess.js"
    
  ],
};

const swaggerSpec = swaggerjsDoc(swaggerOption);

module.exports = { swaggerUi, swaggerSpec };
