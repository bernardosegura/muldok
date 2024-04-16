const fs = require('fs');
const main = fs.readFileSync("main.js", 'utf8');
let tmpmain = main;
const localFiles = [];
localFiles["index.html"] =  Buffer.from(fs.readFileSync("index.html", 'utf8')).toString('base64');
localFiles["despliegue.html"] = Buffer.from(fs.readFileSync("despliegue.html", 'utf8')).toString('base64');
localFiles["servicios.html"] = Buffer.from(fs.readFileSync("servicios.html", 'utf8')).toString('base64');
localFiles["app.js"] = Buffer.from(fs.readFileSync("js/app.js", 'utf8')).toString('base64');
localFiles["css"] = loadCSS("css");

function loadCSS(carpeta){
 	const path = require('path');
 	let contenidoCSS = "";

	fs.readdirSync(carpeta).forEach(nombreArchivo => {
	    let file = path.join(carpeta, nombreArchivo);
	    if (fs.statSync(file).isFile()) {
	        contenidoCSS += fs.readFileSync(file, 'utf-8');
	    }
	});
		
	return Buffer.from(contenidoCSS).toString('base64');
} 

for (let file in localFiles) {
		tmpmain = tmpmain.replace("${"+file+"}",localFiles[file]);
}

fs.writeFileSync("tmpmain.js", tmpmain);
