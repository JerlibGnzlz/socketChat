const socketClient = io();

const nombreUsuario = document.querySelector("#nombreUsuario");
const formulario = document.querySelector("#formulario");
const inputMensaje = document.querySelector("#mensaje");
const chatParrafo = document.querySelector("#chatParrafo");


let usuario = null;

if (!usuario) {
    Swal.fire({
        title: "Bienvenido",
        text: 'Ingresa tu Usuario.',
        input: "text",
        inputValidator: (value) => {
            if (!value) {
                return "Necesitas ingresar un usuario.!";
            }
        },
    })
        .then(userName => {
            usuario = userName.value;
            nombreUsuario.textContent = usuario;
            socketClient.emit("nuevoUsuario", usuario);
        });

}

formulario.onsubmit = (e) => {
    e.preventDefault();

    const info = {
        nombre: usuario,
        mensaje: inputMensaje.value
    };

    socketClient.emit("mensaje", (info));
    inputMensaje.value = "";

};

socketClient.on("chat", mensajes => {

    const htmlRender = mensajes.map(mensaje => {
        return ` <p><strong>${mensaje.nombre}: </strong>${mensaje.mensaje}</p>`;
    }).join(" ");

    chatParrafo.innerHTML = htmlRender;
});

socketClient.on("broadcast", nuevoUsuario => {
    Toastify({
        text: `Ingreso: ${nuevoUsuario} al chat`,
        duration: 5000,
        position: "right",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
});