import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { RegisterRoutes } from "./routes/routes";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../../dist/swagger.json";

const app = express();
app.use(bodyParser.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

RegisterRoutes(app);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const status = (err as any).status || 500;
  res.status(status).json({ message: err.message });
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.listen(3000, () => {
  console.log('API online! 🚀\nAcesse a documentação em http://localhost:3000/docs')
})

export default app;
