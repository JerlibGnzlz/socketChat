import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";

const app = express();
const PORT = 8080;

//! ─── Acepta Todo Tipo De Archivos ────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//!─── Archvios Estaticos ──────────────────────────────────────────────────────

app.use(express.static(__dirname + "/public"));


//!─── Motor De Plantilas ──────────────────────────────────────────────────────

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");


//! ─── Ruta ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.render("socket");
});

//!─── Socket ──────────────────────────────────────────────────────────────────
const httpServer = app.listen(PORT, () => {
    console.log(`listen on port http://localhost:${PORT}`);
});

const socketServer = new Server(httpServer);

const mensajes = [];

socketServer.on("connection", (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log("Usuario desconectado");
    });

    socket.on("mensaje", info => {
        mensajes.push(info);
        socketServer.emit("chat", mensajes);

    });
    socket.on("nuevoUsuario", usuario => {
        socket.broadcast.emit("broadcast", usuario);
    });

});
