import express, { Express, NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { Error } from "./types";
import * as dotenv from "dotenv";
import usersRoutes from "./routes/usersRoutes";
import sessionsRoute from "./routes/sessionRoute";
import cors from "cors";
import songsRoute from "./routes/songRoutes";

import swaggerJsDoc from "swagger-jsdoc";
import swaggerFile from './swagger_output.json'

dotenv.config();
const port: Number = Number(process.env.PORT) || 3000;
const app: Express = express();
const swaggerDocument: Object = YAML.load("./swagger.yaml");


// Middleware
app.use(express.json());
app.use(express.static("public"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(cors());

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  return res
    .status(err.statusCode || 500)
    .send(err.message || "Internal Server Error");
});

// Routes

app.use("/users", usersRoutes);
app.use("/sessions", sessionsRoute);
app.use("/songs", songsRoute);

// Health check
app.get("/health-check", (req, res) => {
  res.status(200).send("OK");
});

// Start the server
app.listen(port, () =>
  console.log(
    `Running at http://localhost:${port} and docs at http://localhost:${port}/docs`
  )
);
