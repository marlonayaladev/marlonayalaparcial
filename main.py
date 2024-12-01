import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from matplotlib.animation import FuncAnimation

# Parámetros físicos
g = 9.8  # gravedad en m/s^2
Cm = 0.2  # coeficiente del efecto Magnus
r = 0.11  # radio del balón en metros
rho = 1.2  # densidad del aire en kg/m^3
A = np.pi * r**2  # área de la sección transversal del balón
m = 0.43  # masa del balón en kg

def calcular_trayectoria(v0, angulo, omega, tiempo_total, dt=0.01):
    angulo_rad = np.radians(angulo)
    vx = v0 * np.cos(angulo_rad)
    vy = v0 * np.sin(angulo_rad)
    x = 0
    y = 0
    posiciones_x = [x]
    posiciones_y = [y]
    posiciones_z = [0]
    velocidades = []
    Fm_x_list = []
    Fm_y_list = []

    t = 0
    while t < tiempo_total:
        # Fuerza de Magnus
        Fm_x = Cm * vy * omega * r
        Fm_y = Cm * vx * omega * r
        Fm_x_list.append(Fm_x)
        Fm_y_list.append(Fm_y)

        # Calcular magnitud de la velocidad
        v = np.sqrt(vx**2 + vy**2)
        velocidades.append(v)

        # Actualizar velocidades
        vx += (Fm_x / m) * dt
        vy += (-g + (Fm_y / m)) * dt
        x += vx * dt
        y += vy * dt
        
        # Imprimir valores para depuración
        print(f"x: {x:.2f}, y: {y:.2f}, t: {t:.2f}")

        # Actualizar z
        z = t * 0.1
        posiciones_z.append(z)

        # Almacenar posiciones
        posiciones_x.append(x)
        posiciones_y.append(y)

        # Si el balón toca el suelo
        if y < 0:
            break
        t += dt

    return posiciones_x, posiciones_y, posiciones_z, velocidades, Fm_x_list, Fm_y_list

# Simulación de un tiro
v0 = 30  # velocidad inicial en m/s
angulo = 25  # ángulo de disparo en grados
omega = 10  # velocidad angular en rad/s
tiempo_total = 5  # tiempo total de simulación en segundos

# Calcular la trayectoria
pos_x, pos_y, pos_z, velocidades, Fm_x_list, Fm_y_list = calcular_trayectoria(v0, angulo, omega, tiempo_total)

# Graficar la trayectoria 2D
plt.figure(figsize=(10, 5))
plt.plot(pos_x, pos_y)
plt.title('Simulación de Tiro Curvo con Efecto Magnus')
plt.xlabel('Distancia (m)')
plt.ylabel('Altura (m)')
plt.xlim(0, max(pos_x) * 1.1)  # Ajustar límites
plt.ylim(0, max(pos_y) * 1.1)  # Ajustar límites
plt.grid(True)
plt.show()

# Graficar la velocidad
plt.figure(figsize=(10, 5))
plt.plot(np.arange(0, len(velocidades) * 0.01, 0.01), velocidades)
plt.title('Velocidad del Balón a lo Largo del Tiempo')
plt.xlabel('Tiempo (s)')
plt.ylabel('Velocidad (m/s)')
plt.grid(True)
plt.show()

# Graficar la fuerza de Magnus
plt.figure(figsize=(10, 5))
plt.plot(np.arange(0, len(Fm_x_list) * 0.01, 0.01), Fm_x_list, label='Fuerza Magnus (X)')
plt.plot(np.arange(0, len(Fm_y_list) * 0.01, 0.01), Fm_y_list, label='Fuerza Magnus (Y)')
plt.title('Fuerza Magnus a lo Largo del Tiempo')
plt.xlabel('Tiempo (s)')
plt.ylabel('Fuerza (N)')
plt.legend()
plt.grid(True)
plt.show()

# Graficar la trayectoria en 3D
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.plot(pos_x, pos_y, pos_z)
ax.set_title('Trayectoria del Balón en 3D')
ax.set_xlabel('Distancia (m)')
ax.set_ylabel('Altura (m)')
ax.set_zlabel('Altura adicional (m)')
plt.show()

# Animación de la trayectoria
fig, ax = plt.subplots()
line, = ax.plot([], [], 'b-', lw=2)
ax.set_xlim(0, max(pos_x) * 1.1)
ax.set_ylim(0, max(pos_y) * 1.1)
ax.set_title('Animación de la Trayectoria del Balón')

def init():
    line.set_data([], [])
    return line,

def update(frame):
    line.set_data(pos_x[:frame], pos_y[:frame])
    return line,

ani = FuncAnimation(fig, update, frames=len(pos_x), init_func=init, blit=True)
plt.show()
