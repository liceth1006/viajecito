import express from 'express';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import ViajecitoRoutes from './routes/viajecito.routes.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuración de Handlebars
app.set('port', 3000);
app.set('views', join(__dirname, 'views'));
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'publicLayout', // Layout por defecto
  layoutsDir: join(__dirname, 'views', 'layouts'),
  partialsDir: join(__dirname, 'views', 'partials'),
}));
app.set('view engine', 'hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rutas
app.use(ViajecitoRoutes);

// Archivos estáticos
app.use(express.static(join(__dirname, 'public')));

// Iniciar servidor
app.listen(app.get('port'), () =>
  console.log('El servidor está escuchando en el puerto', app.get('port'))
);
