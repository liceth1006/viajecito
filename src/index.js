import express from "express";
import morgan from "morgan";
import { engine } from "express-handlebars";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import ViajecitoRoutes from "./routes/viajecito.routes.js";



//inicializacion
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

//setting
app.set("port", process.env.PORT || 3000);
app.set("views", join(__dirname, "views"));
app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    layoutsDir: join(app.get("views"), "layouts"),
    partialsDir: join(app.get("views"), "partials"),
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");





//middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//routes

app.use(ViajecitoRoutes);

//public files
app.use(express.static(join(__dirname, "public")));

//run server

app.listen(app.get("port"), () =>
  console.log("el servidor esta escuchando en el puerto ", app.get("port"))
);
