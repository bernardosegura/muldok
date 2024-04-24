const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const multer = require('multer');

const fs = require('fs');
const os = require('os');

const app = express();
const version = "v1.0.42404202";
const portBaPu = process.argv.length < 3?3000:process.argv[2];
const port = parseInt(portBaPu) + 1;
const appName = "muldok";
//const tmpDF = "RlJPTSBhbmFwc2l4L2FscGluZS1qYXZhOjhfamRrX25hc2hvcm4KCkVOViBNVUxFX0hPTUU9L29wdC9tdWxlIE1VTEVfVkVSU0lPTj0ke211bGVfdmVyc2lvbn0gTVVMRV9VU0VSPW11bGUgTVVMRV9TUlY9JHttdWxlX2FwcH0gJHt2YXJpYWJsZXNfZ2xvYmFsZXN9CgkKUlVOIGFkZHVzZXIgLUQgLWcgIiIgJHtNVUxFX1VTRVJ9ICR7TVVMRV9VU0VSfQoKQUREIG11bGUtZWUtZGlzdHJpYnV0aW9uLXN0YW5kYWxvbmUtJHtNVUxFX1ZFUlNJT059LnppcCAvb3B0CkFERCAke2phclVQfS8ke01VTEVfU1JWfSAvb3B0CgkKUlVOIGNkIC9vcHQgXAoJCQkJJiYgdW56aXAgbXVsZS1lZS1kaXN0cmlidXRpb24tc3RhbmRhbG9uZS0ke01VTEVfVkVSU0lPTn0uemlwIFwKCQkJCSYmIG12IG11bGUtZW50ZXJwcmlzZS1zdGFuZGFsb25lLSR7TVVMRV9WRVJTSU9OfSBtdWxlIFwKCQkJCSYmIGNwIC4vJHtNVUxFX1NSVn0gbXVsZS9hcHBzIFwKCQkJCSYmIHJtIC4vJHtNVUxFX1NSVn0gXAoJCQkJJiYgY2hvd24gJHtNVUxFX1VTRVJ9OiR7TVVMRV9VU0VSfSAtUiAvb3B0L211bGUqCgpVU0VSICR7TVVMRV9VU0VSfQoKVk9MVU1FIFsiJHtNVUxFX0hPTUV9L2xvZ3MiLCAiJHtNVUxFX0hPTUV9L2NvbmYiLCAiJHtNVUxFX0hPTUV9L2FwcHMiLCAiJHtNVUxFX0hPTUV9L2RvbWFpbnMiXQoKV09SS0RJUiAke01VTEVfSE9NRX0KCkNNRCBbICIvb3B0L211bGUvYmluL211bGUiLCItTS1Eb3JnLm11bGUudG9vbGluZy5ydW50aW1lLmFyZ3M9XCItWFg6LVVzZUJpYXNlZExvY2tpbmcgLURmaWxlLmVuY29kaW5nPVVURi04IC1YWDorVXNlRzFHQyAtWFg6K1VzZVN0cmluZ0RlZHVwbGljYXRpb24gLURtdWxlLmRlcGxveW1lbnQuZm9yY2VQYXJzZUNvbmZpZ1htbHM9dHJ1ZVwiIl0KCkVYUE9TRSAke3B1ZXJ0b19pbnRlcm5vfQ==";
const tmpDF = "RlJPTSBhbmFwc2l4L2FscGluZS1qYXZhOjhfamRrX25hc2hvcm4KCkVOViBNVUxFX0hPTUU9L29wdC9tdWxlIE1VTEVfVkVSU0lPTj0ke211bGVfdmVyc2lvbn0gTVVMRV9VU0VSPW11bGUgTVVMRV9TUlY9JHttdWxlX2FwcH0gJHt2YXJpYWJsZXNfZ2xvYmFsZXN9CgkKUlVOIGFkZHVzZXIgLUQgLWcgIiIgJHtNVUxFX1VTRVJ9ICR7TVVMRV9VU0VSfQoKQUREIG9wZW5qZGstOHU0MDItYjA2LnppcCAvb3B0CgpBREQgbXVsZS1lZS1kaXN0cmlidXRpb24tc3RhbmRhbG9uZS0ke01VTEVfVkVSU0lPTn0uemlwIC9vcHQKQUREICR7amFyVVB9LyR7TVVMRV9TUlZ9IC9vcHQKCQpSVU4gY2QgL29wdCBcCgkJCQkmJiB1bnppcCBvcGVuamRrLTh1NDAyLWIwNi56aXAgXAoJCQkJJiYgdGFyIC14emYgb3Blbmpkay04dTQwMi1iMDYudGFyLmd6IC1DIC9vcHQvamRrIC0tc3RyaXAtY29tcG9uZW50cz0xIFwKCQkJCSYmIHVuemlwIG11bGUtZWUtZGlzdHJpYnV0aW9uLXN0YW5kYWxvbmUtJHtNVUxFX1ZFUlNJT059LnppcCBcCgkJCQkmJiBtdiBtdWxlLWVudGVycHJpc2Utc3RhbmRhbG9uZS0ke01VTEVfVkVSU0lPTn0gbXVsZSBcCgkJCQkmJiBjcCAuLyR7TVVMRV9TUlZ9IG11bGUvYXBwcyBcCgkJCQkmJiBybSAuL29wZW5qZGstOHU0MDItYjA2LnppcCBcCgkJCQkmJiBybSAuL29wZW5qZGstOHU0MDItYjA2LnRhci5neiBcCgkJCQkmJiBybSAuLyR7TVVMRV9TUlZ9IFwKCQkJCSYmIHJtIC4vbXVsZS1lZS1kaXN0cmlidXRpb24tc3RhbmRhbG9uZS0ke01VTEVfVkVSU0lPTn0uemlwIFwKCQkJCSYmIGNob3duICR7TVVMRV9VU0VSfToke01VTEVfVVNFUn0gLVIgL29wdC9tdWxlKgoKVVNFUiAke01VTEVfVVNFUn0KClZPTFVNRSBbIiR7TVVMRV9IT01FfS9sb2dzIiwgIiR7TVVMRV9IT01FfS9jb25mIiwgIiR7TVVMRV9IT01FfS9hcHBzIiwgIiR7TVVMRV9IT01FfS9kb21haW5zIl0KCldPUktESVIgJHtNVUxFX0hPTUV9CgpDTUQgWyAiL29wdC9tdWxlL2Jpbi9tdWxlIiwiLU0tRG9yZy5tdWxlLnRvb2xpbmcucnVudGltZS5hcmdzPVwiLVhYOi1Vc2VCaWFzZWRMb2NraW5nIC1EZmlsZS5lbmNvZGluZz1VVEYtOCAtWFg6K1VzZUcxR0MgLVhYOitVc2VTdHJpbmdEZWR1cGxpY2F0aW9uIC1EbXVsZS5kZXBsb3ltZW50LmZvcmNlUGFyc2VDb25maWdYbWxzPXRydWVcIiJdCgpFWFBPU0UgJHtwdWVydG9faW50ZXJub30=";
let configPorts = {};
let bapu = (os.platform() == "win32")? "bapu.exe":"./bapu";
const pathAPP = (process.execPath.endsWith("muldok.exe") || process.execPath.endsWith("muldok"))? require('path').dirname(process.execPath):__dirname; 
const jarUP = "jarup";
const localFiles = [];
localFiles["index.html"] = "${index.html}";
localFiles["despliegue.html"] = "${despliegue.html}";
localFiles["servicios.html"] = "${servicios.html}";
localFiles["app.js"] = "${app.js}";
localFiles["css"] = "${css}";

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, jarUP + '/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

configPorts[appName] = port;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


console.log(`\nIniciando MulDok ${version}`);
process.stdout.write('Validando Registro...');

if (fs.existsSync("apiReg.json")) {
  let jsonCont = fs.readFileSync("apiReg.json", 'utf8');

  if(jsonCont != "")
  	configPorts = Object.assign({}, JSON.parse(jsonCont), configPorts); 
     
  fs.writeFile("apiReg.json", JSON.stringify(configPorts),(e)=>{}); 
} else {
  fs.writeFile("apiReg.json", JSON.stringify(configPorts),(e)=>{});
}
process.stdout.write(' \x1b[32mOK\x1b[0m ');
process.stdout.write('\nValidando Directorios.');
if(!fs.existsSync(jarUP)) {
	  fs.mkdirSync(jarUP, { recursive: true });	  
}
process.stdout.write('.');
if(!fs.existsSync("logs")) {
	  fs.mkdirSync("logs", { recursive: true });	  
}
process.stdout.write('.');

process.stdout.write(' \x1b[32mOK\x1b[0m ');
process.stdout.write(`\nValidando openJDK... `);
if(!fs.existsSync("openjdk-8u402-b06.zip")) {
	console.error(`\x1b[31mNo se encontro el archivo openjdk-8u402-b06.zip\x1b[0m`);
	process.exit(0);		
}

process.stdout.write(' \x1b[32mOK\x1b[0m ');
process.stdout.write(`\nIniciando BaPu... `);
initBaPu(bapu);


function initBaPu(bapu){
	const childProcess = exec(bapu + ` ${portBaPu}`);

	childProcess.stdout.on('data', (data) => {
	   if(data.includes("BaPu escuchando en")){
	   		process.stdout.write('\x1b[32mOK\x1b[0m \nValidando Docker...');
	   		const dockerProcess = exec("docker -v");

			dockerProcess.stdout.on('data', (data) => {
					if(data.includes("Docker version")){
						process.stdout.write('\x1b[32mOK\x1b[0m \n');
				   		app.listen(port,() => {
						  console.log(`MulDok en \x1b[34mhttp://localhost:${portBaPu}/${appName}/app/\x1b[0m`);
						});
					}
			});

			dockerProcess.stderr.on('data', (data) => {
			  console.error(`\x1b[31m${data}\x1b[0m`);
			  //console.log("Terminar proceso: "+ bapu + " manualmente");
			  process.exit(0);
			});
	   }
	});

	childProcess.stderr.on('data', (data) => {
	  console.error(`\x1b[31m${data}\x1b[0m`);
	});

	childProcess.on('close', (code) => {
	  //console.log("Terminar proceso: "+ bapu + " manualmente");	
	  process.exit(0);
	});
}

function loadCSS(carpeta){
 	const path = require('path');
 	let contenidoCSS = "";

 	if(localFiles["css"] == "${css}"){
		fs.readdirSync(carpeta).forEach(nombreArchivo => {
		    let file = path.join(carpeta, nombreArchivo);
		    if (fs.statSync(file).isFile()) {
		        contenidoCSS += fs.readFileSync(file, 'utf-8');
		    }
		});
	}else{
		contenidoCSS = Buffer.from(localFiles["css"], 'base64').toString('utf-8')
	}	
	return contenidoCSS;
}  

app.get('/app/:file?', (req, res) => {
	const file = (req.params.file)?req.params.file:'index.html';
 	let CSSs = "";
	try {
		if(file == "exit"){
			process.exit(0);
		}else{
			let nombre_svr = "";
	  		let version_svr = "";
	  		let nom_jar_srv = "";
	  		let version_mule = "";
			const data = (!localFiles[file])?fs.readFileSync(file, 'utf8'):((localFiles[file] == "${"+file+"}")?fs.readFileSync(file, 'utf8'):Buffer.from(localFiles[file], 'base64').toString('utf-8'));

			if(fs.existsSync("mule-ee-distribution-standalone-4.3.0.zip")) {
			   version_mule = "4.3.0";
			}

			if(fs.existsSync("mule-ee-distribution-standalone-4.4.0.zip")) {
			   version_mule = "4.4.0";
			}

			if(fs.existsSync("mule-ee-distribution-standalone-4.5.2.zip")) {
			   version_mule = "4.5.2";
			}

	  		CSSs = loadCSS("css");
	  		res.send(data.replace('<style type="text/css"></style>','<style type="text/css">'+CSSs+'</style>').replace("<--nombre_svr-->",nombre_svr).replace("<--version_svr-->",version_svr).replace("<--nom_jar_srv-->",nom_jar_srv).replace("<--version_mule-->",version_mule));
		}  
	} catch (err) {
	  res.send('{"estado":"-1","mensaje":"'+err.message+'"}');
	}
  
});

app.post('/app', upload.single('servicio'), (req, res) => {
	try {	
	  	res.send('{"estado":"0","mensaje":"OK"}');	
	} catch (err) {
	  res.send('{"estado":"-1","mensaje":"'+err.message+'"}');
	}
  
});


app.get('/app/js/:file', (req, res) => {
	const file = (req.params.file)?req.params.file:'';
	const os = require('os');

	try {
		const data = (!localFiles[file])?fs.readFileSync("js/"+file, 'utf8'):((localFiles[file] == "${"+file+"}")?fs.readFileSync("js/"+file, 'utf8'):Buffer.from(localFiles[file], 'base64').toString('utf-8'));
		res.send(data.replace("<-appName->",appName).replace("${version}",version));	
	} catch (err) {
		res.send('{"estado":"-2","mensaje":"'+err.message+'"}');
	}
}); 

app.put('/app/creardf', (req, res) => {
	let resp = {};
	let df = "Dockerfile." + req.body.nombre;
	try {
		if(!fs.existsSync(jarUP + "/" + req.body.nom_jar_srv)) {
		  res.send('{"estado":"-4","mensaje":"Se requiere cargar un servicio."}');
		  return;
		}

		if(!fs.existsSync("mule-ee-distribution-standalone-" + req.body.verMuleSoft + ".zip")) {
		  res.send('{"estado":"-4","mensaje":"Se requiere una versión de mule valida."}');
		  return;
		}

		if(fs.existsSync("apiReg.json")) {
		  let srvdsp = false;	
		  let json = JSON.parse(fs.readFileSync("apiReg.json", 'utf8'));
		  for (let propiedad in json) {
				if(propiedad == req.body.nombre + ":" + req.body.version){
					srvdsp = true;
					break;
				} 
		  			
			}
		  if(srvdsp){
			 res.send('{"estado":"-4","mensaje":"Servicio ya desplegado."}');
			 return;
		  }
		}
		
		/*if(fs.existsSync("Dockerfile_plantilla")) {
		  let dCont = fs.readFileSync("Dockerfile_plantilla", 'utf8').replace("<--mule_version-->",req.body.verMuleSoft).replace("<--mule_app-->",req.body.nom_jar_srv).replace("<--variables_globales-->",req.body.envVars).replace("<--puerto_interno-->",req.body.puerto_int);
		  fs.writeFileSync(df, dCont);
		}*/
		let dCont = Buffer.from(tmpDF, 'base64').toString('utf-8').replace("${mule_version}",req.body.verMuleSoft).replace("${mule_app}",req.body.nom_jar_srv).replace("${variables_globales}",req.body.envVars).replace("${puerto_interno}",req.body.puerto_int).replace("${jarUP}",jarUP);
		fs.writeFileSync(df, dCont);

		resp.estado = 0;
		resp.mensaje = "OK";
		resp.data = {};
		resp.data.nombre = req.body.nombre;
		resp.data.version = req.body.version;
		resp.data.puerto_int = req.body.puerto_int;
		resp.data.df = df;
		resp.data.nom_jar = req.body.nom_jar_srv;
		res.send(JSON.stringify(resp)); 

	} catch (err) {
	  res.send('{"estado":"-1","mensaje":"'+err.message+'"}');
	}
	
});

app.put('/app/crearimg', (req, res) => {
	let resp = {};
	const { exec } = require('child_process');

	exec('docker build --file="'+req.body.df+'" --tag="'+req.body.nombre+':'+req.body.version+'" .', (error, stdout, stderr) => {
	  const path = require('path');
	  const logs = path.join(pathAPP, "logs",req.body.nombre,req.body.version);
	  resp.estado = 0;
	  resp.mensaje = "OK";
	  resp.data = {};
	  resp.data.nombre = req.body.nombre;
	  resp.data.version = req.body.version;
	  resp.data.puerto_int = req.body.puerto_int;
	  
	  if (stderr) {
	  	let nameimg = req.body.nombre + ":" + req.body.version;
	  	let regex = new RegExp(`${nameimg}.*done`, 'g');
	  	if(stderr.match(regex) !== null){
	  		res.send(JSON.stringify(resp));
	  		fs.unlink(path.join(jarUP,req.body.nom_jar), (error) => {});
	  		fs.unlink(req.body.df, (error) => {});
	  		fs.mkdir(logs, { recursive: true }, (error) => {});
	  	}else
			res.send('{"estado":"-3","mensaje":"'+stderr.replace(/"/g,'\\"').replace(/\n/g, " ").trim()+'"}');
		return;
	  }
	   res.send(JSON.stringify(resp));
	   fs.unlink(path.join(jarUP,req.body.nom_jar), (error) => {});
	   fs.unlink(req.body.df, (error) => {});
	   fs.mkdir(logs, { recursive: true }, (error) => {});
	});
});

app.put('/app/creardrun', (req, res) => {
	let resp = {};
	const { exec } = require('child_process');
	const path = require('path');
	let maxPort = port;
	let log = path.join(pathAPP, "logs",req.body.nombre,req.body.version);
	if(fs.existsSync("apiReg.json")) {
	  let jsonCont = fs.readFileSync("apiReg.json", 'utf8');
	  let json = JSON.parse(jsonCont);
	  for (let propiedad in json) {
			if(maxPort < json[propiedad] && propiedad != (req.body.nombre+':'+req.body.version)) 
		    	maxPort = json[propiedad];
		}
	}
	maxPort =  parseInt(maxPort) + 1;
	exec('docker run -d -p "'+maxPort+":"+req.body.puerto_int+'" -it -u mule:mule -v "'+log+'":/opt/mule/logs '+req.body.nombre+':'+req.body.version+'', (error, stdout, stderr) => {
	  resp.estado = 0;
	  resp.mensaje = "OK";
	  resp.data = {};
	  resp.data.nombre = req.body.nombre;
	  resp.data.version = req.body.version;
	  resp.data.puerto = maxPort;
	  resp.data.urlbase = "http://{nombreServidor}:"+portBaPu+"/";
	  
	  if (stderr) {
		res.send('{"estado":"-5","mensaje":"'+stderr.replace(/"/g,'\\"').replace(/\n/g, " ").trim()+'"}');
		return;
	  }
	  res.send(JSON.stringify(resp));
	});
});

app.get('/app/get/servicios', (req, res) => {
	const { exec } = require('child_process');
	let filtros = "";
	if(fs.existsSync("apiReg.json")) {
	  let json = JSON.parse(fs.readFileSync("apiReg.json", 'utf8'));
	  for (let propiedad in json) {
			if(propiedad != "registry" && propiedad != "muldok") 
		    	filtros += ' --filter "ancestor=' + propiedad+'"';
		}
	}
	if(filtros != ""){
		exec('docker ps -a --format "{{json .}}"' + filtros, (error, stdout, stderr) => {
		  if (stderr) {
			res.send('{"estado":"-4","mensaje":"'+stderr.replace(/"/g,'\\"').replace(/\n/g, " ").trim()+'"}');
			return;
		  }
		   res.send('{"estado":"0","mensaje":"OK","nombreServidor":"http://{nombreServidor}:'+portBaPu+'/","containers":'+JSON.stringify(stdout.split('\n'))+'}');
		});
	}else{
		   res.send('{"estado":"0","mensaje":"OK","nombreServidor":"http://{nombreServidor}:'+portBaPu+'/","containers":[]}');
	}
	
});

app.get('/app/log/:servicio', (req, res) => {
	const { exec } = require('child_process');
	let carpeta = req.params.servicio.split(":");
	const path = require('path');
	let log = path.join(pathAPP, "logs");
	let txtLog = "";
	let logDir = log;
	for (var i = 0; i < carpeta.length; i++) {
		log = path.join(log, carpeta[i]);
	}
	logDir = log;
	log = path.join(log, carpeta[0] + ".log");

	if(fs.existsSync(log)) {
	  txtLog = Buffer.from(fs.readFileSync(log, 'utf8')).toString('base64');
	  res.send('{"estado":"0","mensaje":"'+txtLog+'"}');
	}else{
		const archivos = fs.readdirSync(logDir);
		const fileLog = archivos.filter(archivo => {
		    const file = path.basename(archivo);
		    return file !== "mule_ee.log" && file !== "mule-domain-default.log" && path.extname(archivo) == ".log";
		  });

		if(fileLog.length > 0){
			txtLog = Buffer.from(fs.readFileSync( path.join(logDir, fileLog[0]), 'utf8')).toString('base64');
	  		res.send('{"estado":"0","mensaje":"'+txtLog+'"}');
		}else{
			res.send('{"estado":"-6","mensaje":"No se encontro log."}');
		}
	}
});

app.get('/app/log/descargar/:servicio', (req, res) => {
	const { exec } = require('child_process');
	let carpeta = req.params.servicio.split(":");
	const path = require('path');
	let log = path.join(pathAPP, "logs");
	let txtLog = "";
	let logDir = log;
	for (var i = 0; i < carpeta.length; i++) {
		log = path.join(log, carpeta[i]);
	}
	logDir = log;
	log = path.join(log, carpeta[0] + ".log");

	if(fs.existsSync(log)) {
		  res.download(log, (error) => {
		    if (error) {
		      res.send('{"estado":"-6","mensaje":"Error al descargar log."}');
		    }
		  });	  
	}else{
		const archivos = fs.readdirSync(logDir);
		const fileLog = archivos.filter(archivo => {
		    const file = path.basename(archivo);
		    return file !== "mule_ee.log" && file !== "mule-domain-default.log" && path.extname(archivo) == ".log";
		  });

		if(fileLog.length > 0){
			res.download(path.join(logDir, fileLog[0]), (error) => {
			    if (error) {
			      res.send('{"estado":"-6","mensaje":"Error al descargar log."}');
			    }
			 });	
		}else{
			res.send('{"estado":"-6","mensaje":"No se encontro log."}');
		}
	}
});

app.put('/app/ined/start/:id', (req, res) => {
	const { exec } = require('child_process');
	exec("docker start " + req.params.id, (error, stdout, stderr) => {
	  if (stderr) {
		res.send('{"estado":"-7","mensaje":"'+stderr.replace(/"/g,'\\"').replace(/\n/g, " ").trim()+'"}');
		return;
	  }
	   //res.send('{"estado":"0","mensaje":"OK","containers":'+JSON.stringify(stdout.split('\n'))+'}');
		exec('docker ps -a --format "{{json .}}" --filter id=' + req.params.id, (error, stdout, stderr) => {
		  if (stderr) {
			res.send('{"estado":"-5","mensaje":"'+stderr.replace(/"/g,'\\"').replace(/\n/g, " ").trim()+'"}');
			return;
		  }
		   res.send('{"estado":"0","mensaje":"OK","containers":'+JSON.stringify(stdout.split('\n'))+'}');
		});
	});
});

app.put('/app/ined/stop/:id', (req, res) => {
	const { exec } = require('child_process');
	exec("docker stop " + req.params.id, (error, stdout, stderr) => {
	  if (stderr) {
		res.send('{"estado":"-8","mensaje":"'+stderr.replace(/"/g,'\\"').replace(/\n/g, " ").trim()+'"}');
		return;
	  }
	   //res.send('{"estado":"0","mensaje":"OK","containers":'+JSON.stringify(stdout.split('\n'))+'}');
		exec('docker ps -a --format "{{json .}}" --filter id=' + req.params.id, (error, stdout, stderr) => {
		  if (stderr) {
			res.send('{"estado":"-5","mensaje":"'+stderr.replace(/"/g,'\\"').replace(/\n/g, " ").trim()+'"}');
			return;
		  }
		   res.send('{"estado":"0","mensaje":"OK","containers":'+JSON.stringify(stdout.split('\n'))+'}');
		});
	});
});

app.delete('/app/servicio/:id', (req, res) => {
	const { exec } = require('child_process');
	exec("docker rm " + req.params.id, (error, stdout, stderr) => {
	  
	  if (stderr) {
		res.send('{"estado":"-8","mensaje":"'+stderr.replace(/"/g,'\\"').replace(/\n/g, " ").trim()+'"}');
		return;
	  }

	  exec("docker image rm -f " + req.body.image, (error, stdout, stderr) => {
		  let carpeta = req.body.image.split(":");
		  const path = require('path');
		  let log = path.join(pathAPP, "logs");
		  let logSrv = log;
		  let logs = "";

		  if (stderr) {
			res.send('{"estado":"-8","mensaje":"'+stderr.replace(/"/g,'\\"').replace(/\n/g, " ").trim()+'"}');
			return;
		  }

		  for (var i = 0; i < carpeta.length; i++) {
		  	 logSrv = path.join(logSrv, carpeta[i]);
		  }

		  logs = fs.readdirSync(logSrv);
		  for (var j = 0; j < logs.length; j++) {
			 fs.unlinkSync(path.join(logSrv,logs[j]));
		  }
		  fs.rmdirSync(logSrv);
		  carpeta.splice((carpeta.length-1), 1);

		  do{
		  	for (var i = 0; i < carpeta.length; i++) {
			  	 logSrv = path.join(log, carpeta[i]);
			  }
			 fs.rmdirSync(logSrv); 
			 carpeta.splice((carpeta.length-1), 1); 
		  }while(carpeta.length > 0);
		  res.send('{"estado":"0","mensaje":"OK","containers":'+JSON.stringify(stdout.split('\n'))+'}');
		});

	});
});