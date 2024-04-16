# <img src="https://github.com/bernardosegura/muldok/blob/master/src/muldok.png" alt="Logo" style="width: 100px; height: 100px;" /> MulDok

Surge como respuesta a la necesidad de ejecutar múltiples servicios de Mulesoft de manera local y permitir su interacción entre sí. Este proyecto fusiona dos iniciativas previas, CAD y BaPu, con el objetivo principal de acelerar el desarrollo y las pruebas de servicios desarrollados con la tecnología de Mulesoft.

Es importante destacar que MulDok está diseñado específicamente para su uso en entornos de desarrollo y pruebas locales, donde los servicios se ejecutan en contenedores Docker. No se recomienda su implementación en entornos productivos.

Se puede ejecutar mediante el [binario](https://github.com/bernardosegura/muldok/tree/master/release) ya compilado y listo para usar tanto en Windows 💻 y Linux 🐧.

### Instalar dependencias
```bash
npm install
```
### Ejecutar desde el fuente
```bash
npm start
```
### Construcción desde el fuente
💻 Windows
```bash 
npm run build:windows
```
🐧 Linux
```bash 
npm run build:linux
```
### Ejecución del binario
Tomar encuestas que requiere dependencias de bapu, docker y de contar con un runtime de mulesoft en el directorio de la ejecución.
```bash
muldok [puerto de escucha http, si se omite por default es 3000]
Iniciando MulDok v1.0.20240415
Validando Registro... OK
Validando Directorios... OK
Iniciando BaPu... OK
Validando Docker...OK
MulDok en http://localhost:3000/muldok/app/
```
