import express from "express";
import indexRoutes from "./routes/indexRoute"

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use('/', indexRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
