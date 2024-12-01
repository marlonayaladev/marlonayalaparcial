const pantallaInicial = document.getElementById('pantalla-inicial');
const simulacion = document.getElementById('simulacion');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const mensajeObjetivo = document.createElement('div');
mensajeObjetivo.id = 'mensaje-objetivo';
mensajeObjetivo.textContent = 'Objetivo atacado';
document.body.appendChild(mensajeObjetivo);

let cuadroObjetivo = { x: 50, y: 150, width: 50, height: 50 }; // Cuadro objetivo inicial

document.getElementById('atacar').addEventListener('click', () => {
    pantallaInicial.style.display = 'none';
    simulacion.classList.remove('oculto');
});

document.getElementById('lanzar').addEventListener('click', lanzar);

function lanzar() {
    const velocidad = parseFloat(document.getElementById('velocidad').value);
    const angulo = parseFloat(document.getElementById('angulo').value) * (Math.PI / 180);
    const g = 9.81; // Gravedad

    let t = 0;
    const dt = 0.1; // Intervalo de tiempo
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

    const x0 = 0; // Posición inicial en x
    const y0 = canvas.height; // Posición inicial en y

    let trayectoria = []; // Array para almacenar la trayectoria del proyectil

    const proyectil = setInterval(() => {
        const x = x0 + velocidad * Math.cos(angulo) * t;
        const y = y0 - (velocidad * Math.sin(angulo) * t - 0.5 * g * t * t);

        // Verifica si el proyectil toca el suelo o el objetivo
        if (y > canvas.height) {
            clearInterval(proyectil);
            return;
        }

        // Verificar colisión con el cuadro objetivo
        if (
            x >= cuadroObjetivo.x &&
            x <= cuadroObjetivo.x + cuadroObjetivo.width &&
            y >= canvas.height - cuadroObjetivo.y - cuadroObjetivo.height &&
            y <= canvas.height - cuadroObjetivo.y
        ) {
            clearInterval(proyectil);
            mensajeObjetivo.style.display = 'block'; // Mostrar mensaje
            setTimeout(() => (mensajeObjetivo.style.display = 'none'), 3000); // Ocultar mensaje después de 3 segundos
            return;
        }

        // Agrega el punto actual a la trayectoria
        trayectoria.push({ x, y });

        // Redibujar todo
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar pantalla
        dibujarEjes(); // Dibujar las reglas en cada actualización
        dibujarCuadroObjetivo(); // Dibujar el cuadro objetivo

        // Dibujar la trayectoria
        ctx.beginPath();
        ctx.moveTo(trayectoria[0].x, trayectoria[0].y); // Inicia desde el primer punto
        for (let i = 1; i < trayectoria.length; i++) {
            ctx.lineTo(trayectoria[i].x, trayectoria[i].y); // Conecta puntos
        }
        ctx.strokeStyle = 'blue'; // Color de la trayectoria
        ctx.stroke();
        ctx.closePath();

        // Dibuja el proyectil (punto rojo)
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();

        t += dt;
    }, dt * 1000);
}

function dibujarEjes() {
    // Dibujar el eje X
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 1); // Línea en la parte inferior
    ctx.lineTo(canvas.width, canvas.height - 1);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();

    // Dibujar el eje Y
    ctx.beginPath();
    ctx.moveTo(1, 0); // Línea en el lado izquierdo
    ctx.lineTo(1, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();

    // Marcas en el eje X
    for (let i = 0; i <= canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, canvas.height - 5); // Marcas hacia abajo
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        ctx.closePath();

        // Etiquetas
        ctx.font = '10px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(i, i, canvas.height - 10);
    }

    // Marcas en el eje Y
    for (let i = 0; i <= canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - i); // Marcas hacia la derecha
        ctx.lineTo(5, canvas.height - i);
        ctx.stroke();
        ctx.closePath();

        // Etiquetas
        ctx.font = '10px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(i, 10, canvas.height - i);
    }
}

function dibujarCuadroObjetivo() {
    ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
    ctx.fillRect(
        cuadroObjetivo.x,
        canvas.height - cuadroObjetivo.y - cuadroObjetivo.height,
        cuadroObjetivo.width,
        cuadroObjetivo.height
    );
}

// Permitir que el usuario mueva el cuadro objetivo con el mouse
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    cuadroObjetivo.x = mouseX - cuadroObjetivo.width / 2;
    cuadroObjetivo.y = canvas.height - mouseY - cuadroObjetivo.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarEjes();
    dibujarCuadroObjetivo();
});
