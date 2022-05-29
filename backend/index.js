const express = require("express");// ใช้งาน module express
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const data = require("./data.json");
const app = express();// สร้างตัวแปร app เป็น instance ของ express app
const port = process.env.PORT || 5000;

const swaggerOptions = {//developหน้าswagger
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "API Swagger",
      description: " API Information",
      servers: ["http://localhost:5000"]
    }
  },
  apis: ["index.js"] 
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
// const corsOptions = {
//   origin: ["http://localhost:80","http://localhost:3000"],
//   optionsSuccessStatus: 200,
// };

app.use(express.json());// แปลงข้อมูลJSON String ให้อยู่ในรูป JSON Objext  
app.use(express.urlencoded({ extended: true }));// แปลงข้อมูลจาก form ในรูปแบบ url encode เป็น Object
app.use(cors())//ทำงานคู้กับexpress
app.use("/swagger-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
/**
 * @swagger
 * /data:
 *  get:
 *    description: data.js
 *    responses:
 *      '200':
 *        description: Successfully
 */

app.get("/data",  (req, res) => {
  res.json(data);
});

app.get("/data/:name", (req, res) => {
  const resalt = data.filter(function(data){return data.name == req.params.name})
  // console.log(resalt.length)
  if(resalt.length > 0){
    res.json(resalt[Math.floor(Math.random() * resalt.length)])
    // console.log(Math.floor(Math.random() * resalt.length))
 }else{
    res.json({})
  }
});

app.listen(port, () => {
  console.log(`Successfully Connect at http://localhost:5000`);
});