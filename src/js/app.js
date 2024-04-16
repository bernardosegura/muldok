var nombreServidor = window.location.hostname;
var app = "<-appName->";
var version = "${version}";
var waitServicio = [];

var Ajax = function(metodo,url, params,callback,asyn=false)
{
	http: "",
	this.obtenResultado = function()
	{
		if(window.XMLHttpRequest)
			http = new XMLHttpRequest();
		else
			http = new ActiveXObject("Microsoft.XMLHTTP");
        http.open(metodo, url, asyn);
        http.setRequestHeader("Content-type", "application/json");
        http.onreadystatechange = function()
        {
	        if(http.readyState == 4)
	        { 
	            if(http.status == 200)
	            {
	                respuesta = http.responseText;
	                callback(respuesta);
	            }
			}        	
        }
        try{
        	http.send(params);
        }catch(error){
        	location.reload();
        }
	}
}

document.addEventListener("DOMContentLoaded", function() {
  
  document.getElementById('lbl_ver').innerHTML = version;
  document.getElementById('servername').innerHTML = '<b> ' + nombreServidor + "</b>";
  despliegue();
});

function cargarContenido(peticion,url,params,obj){
	new Ajax(peticion,url,params,resp =>{
		if(!obj)
			document.getElementById("container").innerHTML = resp;
		else{
			for (var key in obj) {
				if(key != "callback")
					resp = resp.replace(new RegExp("{" + key + "}", "g"), obj[key]);
			}
			document.getElementById("container").innerHTML = resp;
			if(obj.callback)
				obj.callback();
		}
  }).obtenResultado();
}

function appExit(){
	new Ajax("GET","/registry/exit","",resp =>{}).obtenResultado();
	closeSMenu();
}

// Función para abrir el diálogo
function openDialog(id) {
  document.getElementById(id).style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

// Función para cerrar el diálogo
function closeDialog(id) {
  document.getElementById(id).style.display = 'none';
  if(document.querySelectorAll(".dialog-container[style='display: block;']").length == 0)
  		document.getElementById('overlay').style.display = 'none';
  if(id == "dialog-log"){
  	 document.getElementById("frm_descargar").action = "/muldok/app/log/descargar/";
  }		
}

function cleanSMenu(){
	for (var i = 0; i < document.querySelectorAll(".sub-menu").length; i++) {
		document.querySelectorAll(".sub-menu")[i].style = "";
	}
}

function closeSMenu(){
	for (var i = 0; i < document.querySelectorAll(".sub-menu").length; i++) {
		document.querySelectorAll(".sub-menu")[i].style.display = "none";
	}
}

function cargarJAR(file){
	let dataSrv = file.split("-");
	let nombre_svr = dataSrv[0].toLowerCase().replace(".jar","");
	version_svr = "";
	if(dataSrv.length > 1)
		version_svr = dataSrv[1].toLowerCase().replace(".jar","");
	
	document.getElementById("txt_nomnre_srv").value = nombre_svr;
	document.getElementById("txt_version_srv").value = version_svr;
}

function entregar(){
	if(!document.getElementById('hdn_nom_jar_srv').value.toLowerCase().endsWith('.jar')){ 
		document.getElementById('dialog-alert-mensaje').innerHTML='No se ha seleccionado ningún archivo valido.';
		openDialog('dialog-alert');
	}else{
		const formData = new FormData(document.getElementById('id_frmupl'));

		document.getElementById('svg_load').style.removeProperty('display');
	    
	    fetch(document.getElementById('id_frmupl').action, {
	        method: 'POST',
	        body: formData/*,
	        headers: {
	            'env_vars_srv': document.getElementById('txt_env_vars_srv').value,
	            'txt_nomnre_srv': document.getElementById('txt_nomnre_srv').value,
	            'txt_version_srv': document.getElementById('txt_version_srv').value,
	            'version_mule': document.getElementById('txt_version_mule').value,
	            'puerto_int_srv': document.getElementById('txt_puerto_int_srv').value
	        }*/
	    }).then(data =>{
	    	return data.text();
	    }).then(resp => {
	    	let data = JSON.parse(resp);
	    	if(data.estado != 0){
				document.getElementById("dialog-alert-mensaje").innerHTML = data.mensaje;
				openDialog('dialog-alert');
			}else{
				desplegar();
			}
	    });	
	}	
}

function despliegue(){
	cargarContenido("GET","/muldok/app/despliegue.html","",{version_mule:document.getElementById("hdn_version_mule").value});
}

function desplegar(){
	let servicio = {};
	if(document.getElementById("txt_nomnre_srv").value == ""){
		document.getElementById('dialog-alert-mensaje').innerHTML='Se requiere un nombre de servicio a desplegar'; 
		openDialog('dialog-alert'); 
		return false;
	}
	servicio.nombre = document.getElementById("txt_nomnre_srv").value;
	if(document.getElementById("txt_version_srv").value == ""){
		servicio.version = "0.0.1";
	}else
		servicio.version = document.getElementById("txt_version_srv").value;
	if(document.getElementById("txt_version_mule").value == ""){
		document.getElementById('dialog-alert-mensaje').innerHTML='Se requiere un versión de MulSoft'; 
		openDialog('dialog-alert'); 
		return false;
	}
	servicio.verMuleSoft = document.getElementById("txt_version_mule").value;	
	if(document.getElementById("txt_puerto_int_srv").value == ""){
		servicio.puerto_int = "8081";
	}else
		servicio.puerto_int = document.getElementById("txt_puerto_int_srv").value;

	if(document.getElementById("hdn_nom_jar_srv").value == ""){
		document.getElementById('dialog-alert-mensaje').innerHTML='Se requiere cargar un servicio.'; 
		openDialog('dialog-alert'); 
		return false;
	}	
	servicio.nom_jar_srv = document.getElementById("hdn_nom_jar_srv").value;

	servicio.envVars = document.getElementById("txt_env_vars_srv").value;	
	document.getElementById("dialog-alert-btnOk").disabled = true;
	document.getElementById("dialog-alert-btnOk").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: relative; top: 2px;" width="24" height="24" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><path d="M10 50A40 40 0 0 0 90 50A40 46 0 0 1 10 50" fill="#FFF" stroke="none"><animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 51;360 50 51"></animateTransform></path></svg>';
	document.getElementById('dialog-alert-mensaje').innerHTML='Creando Componentes... '; 
	openDialog('dialog-alert');
	new Ajax("PUT","/muldok/app/creardf",JSON.stringify(servicio),resp =>{
		let info = JSON.parse(resp);
		if(info.estado != 0){
			document.getElementById("dialog-alert-mensaje").innerHTML = info.mensaje;
			document.getElementById("dialog-alert-btnOk").innerHTML = "Aceptar";
			document.getElementById("dialog-alert-btnOk").disabled = false;
			if(info.estado == -4){
				limpiarDespliegue();
				/*document.getElementById("txt_nomnre_srv").value = "";
				document.getElementById("txt_puerto_int_srv").value = "";
				document.getElementById("txt_version_srv").value = "";
				document.getElementById("txt_env_vars_srv").value = "";
				document.getElementById("hdn_nom_jar_srv").value = "";
				document.getElementById("hdn_nombre_svr").value = "";
				document.getElementById("hdn_version_svr").value = "";*/
				//document.getElementById("desp_jar").innerHTML = "";
			}

		}else{
			document.getElementById("dialog-alert-mensaje").innerHTML += info.mensaje + "<br>";
			document.getElementById("dialog-alert-mensaje").innerHTML += "Creando Imagen... ";

			new Ajax("PUT","/muldok/app/crearimg",JSON.stringify(info.data),resp =>{
				let info = JSON.parse(resp);
				if(info.estado != 0){
					document.getElementById("dialog-alert-mensaje").innerHTML = info.mensaje;
					document.getElementById("dialog-alert-btnOk").innerHTML = "Aceptar";
					document.getElementById("dialog-alert-btnOk").disabled = false;

				}else{
					document.getElementById("dialog-alert-mensaje").innerHTML += info.mensaje + "<br>";
					document.getElementById("dialog-alert-mensaje").innerHTML += "Levantando Contenedor... ";
					new Ajax("PUT","/muldok/app/creardrun",JSON.stringify(info.data),resp =>{
						let info = JSON.parse(resp);
						if(info.estado != 0){
							document.getElementById("dialog-alert-mensaje").innerHTML = info.mensaje;
							document.getElementById("dialog-alert-btnOk").innerHTML = "Aceptar";
							document.getElementById("dialog-alert-btnOk").disabled = false;

						}else{
							document.getElementById("dialog-alert-mensaje").innerHTML += info.mensaje + "<br>";
							document.getElementById("dialog-alert-mensaje").innerHTML += "Registrando Servicio... ";
							let urlSrv = info.data.urlbase.replace("{nombreServidor}",nombreServidor) + info.data.nombre+':'+info.data.version+"/";
							new Ajax("GET","/registry/set/"+info.data.nombre+':'+info.data.version+"/"+info.data.puerto,JSON.stringify(info.data),resp =>{
								let info = JSON.parse(resp);
								if(info.estado != 0){
									document.getElementById("dialog-alert-mensaje").innerHTML = info.mensaje;
									document.getElementById("dialog-alert-btnOk").innerHTML = "Aceptar";
									document.getElementById("dialog-alert-btnOk").disabled = false;

								}else{
									document.getElementById("dialog-alert-mensaje").innerHTML += info.mensaje + "<br>";
									document.getElementById("dialog-alert-mensaje").innerHTML += "Servicio Registrado en: " + urlSrv;
									document.getElementById("dialog-alert-btnOk").innerHTML = "Aceptar";
									document.getElementById("dialog-alert-btnOk").disabled = false;
									document.getElementById("dialog-alert-btnServicios").style.removeProperty('display');

									limpiarDespliegue();
									//document.getElementById("desp_jar").innerHTML = "";
								}
								
							}, true).obtenResultado();
						}
						
					}, true).obtenResultado();
				}
				
			}, true).obtenResultado();
		}
		
	}, true).obtenResultado();
}

function limpiarDespliegue(){
	document.getElementById("txt_nomnre_srv").value = "";
	document.getElementById("txt_puerto_int_srv").value = "";
	document.getElementById("txt_version_srv").value = "";
	document.getElementById("txt_env_vars_srv").value = "";
	document.getElementById("hdn_nom_jar_srv").value = "";
	document.getElementById('nameFile').innerHTML='<b>Archivo: </b>';
}

function get_servicios(){
	cargarContenido("GET","/muldok/app/servicios.html","",{servername:nombreServidor, callback:obten_servicios});
}

function obten_servicios(){
	new Ajax("GET","/muldok/app/get/servicios","",resp =>{
		let data = JSON.parse(resp);
		if(data.estado != 0){
			document.getElementById("dialog-alert-mensaje").innerHTML = data.mensaje;
			openDialog('dialog-alert');
		}else{
			let html = "";
			for (let i = 0; i < (data.containers.length - 1); i++) {
				let container = JSON.parse(data.containers[i]);
				let btnAccion = ""; 
				let clasesAccion = "btn";
				let btntitle = "";
				let btnEliminarC = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#FFF" style="position: relative; top: 2px;" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M16 6l-1.5-1.5h-7L8 6M4 7v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7"></path></svg>';
				let colorTxtState = 'color: ';
				let accionbtn = "";
				let ojinio = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 662" width="18" height="18" style="position: relative; top: 2px;" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(0.000000,662.000000) scale(0.100000,-0.100000)" fill="#FFF" stroke="none"><path d="M6330 6609 c-1718 -102 -3518 -884 -5200 -2260 -336 -274 -685 -593 -956 -873 l-173 -178 91 -99 c144 -156 523 -517 803 -764 1394 -1232 2845 -2012 4275 -2299 486 -97 816 -130 1320 -130 383 -1 517 7 845 49 1372 176 2726 781 3982 1781 517 411 1037 915 1406 1362 l78 93 -27 32 c-463 555 -984 1081 -1491 1504 -1537 1283 -3211 1885 -4953 1782z m464 -584 c362 -42 679 -139 1002 -304 957 -491 1538 -1464 1501 -2511 -22 -585 -223 -1125 -593 -1590 -87 -109 -314 -336 -424 -424 -403 -322 -876 -525 -1410 -607 -214 -33 -590 -33 -810 0 -560 83 -1055 305 -1470 656 -119 101 -310 302 -403 423 -298 389 -481 840 -542 1332 -30 243 -15 583 35 831 237 1162 1221 2047 2440 2193 160 19 514 20 674 1z"/><path d="M6325 4819 c-557 -58 -1040 -395 -1274 -889 -180 -380 -196 -802 -47 -1188 166 -430 522 -771 959 -917 203 -68 276 -79 527 -79 212 0 232 1 345 28 147 34 230 64 360 126 437 210 750 611 852 1090 28 130 25 469 -4 600 -58 259 -165 475 -334 677 -331 394 -863 606 -1384 552z"/></g></svg>';
				if(container.State == "exited" || container.State == "created"){
					 btnAccion = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#FFF" style="position: relative; top: 2px;"><path d="M8 5v14l11-7z"/></svg>';
					 btntitle = "Click para Iniciar";
					  colorTxtState = 'color:  #678cac;';
					  accionbtn = "start";
					  
				}else{
					btnAccion = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFF" style="position: relative; top: 2px;"><path d="M6 6h12v12H6z"/></svg>';
					clasesAccion += " btn-stop";	
					btntitle = "Click para Detener";
					colorTxtState = 'color:  #007bff;';
					accionbtn = "stop";
				}
					
				let tr = "<tr id=\"fila_"+i+"\"><td style=\"text-align: center;\"><a href=\"#\" id=\"log_"+i+"\" onClick=\"verlog('"+i+"','"+container.Image+"')\" class=\"btn btn-log\" style='padding: 6px 8px; position: relative; top: -3px;' title = 'Click para ver Log'>"+ojinio+"</a> <a href=\"#\" id=\"del_"+i+"\" onClick=\"deleteServicio('"+i+"','"+container.ID+"','"+container.Image+"')\" class=\"btn btn-danger\" style='padding: 6px 8px; position: relative; top: -3px;' title = 'Click para Eliminar'>"+btnEliminarC+"</a> <a href=\"#\" onClick=\"ined_Servicio('"+i+"','"+container.ID+"','"+accionbtn+"')\" class=\""+clasesAccion+"\" style='padding: 3px 5px;' title = '"+btntitle+"' id=\"acc_"+i+"\">"+btnAccion+"</a></td>";
				tr += "<td style='text-align: center;'>"+container.Image+"</td>";
				tr += "<td style='text-align: center;'>"+container.RunningFor+"</td>";
				tr += "<td style='text-align: center; "+colorTxtState+" cursor: pointer' title='"+container.Status+"'><b>"+container.State+"</b></td>";
				//tr += "<td>"+container.Ports+"</td>";
				tr += "<td style='text-align: center;'><a target='_blank' href='"+data.nombreServidor.replace("{nombreServidor}",nombreServidor)+container.Image+"/'>"+data.nombreServidor.replace("{nombreServidor}",nombreServidor)+container.Image+"/</a></td>";
				html += tr;
			}
			document.getElementById("tbodyPs").innerHTML = html;
		}
	}).obtenResultado();

}

function verlog(fl,servicio){
	if(!document.getElementById("load_log_" + fl)){
		document.getElementById("log_" + fl).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="load_log_'+fl+'" style="position: relative; top: 2px;" width="18" height="18" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><path d="M10 50A40 40 0 0 0 90 50A40 46 0 0 1 10 50" fill="#FFF" stroke="none"><animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 51;360 50 51"></animateTransform></path></svg>';
		new Ajax("GET","/muldok/app/log/"+servicio,"",resp =>{
			let data = JSON.parse(resp);
			if(data.estado != 0){
				document.getElementById("dialog-alert-mensaje").innerHTML = data.mensaje;
				openDialog('dialog-alert');
				document.getElementById("log_" + fl).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 662" width="18" height="18" style="position: relative; top: 2px;" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(0.000000,662.000000) scale(0.100000,-0.100000)" fill="#FFF" stroke="none"><path d="M6330 6609 c-1718 -102 -3518 -884 -5200 -2260 -336 -274 -685 -593 -956 -873 l-173 -178 91 -99 c144 -156 523 -517 803 -764 1394 -1232 2845 -2012 4275 -2299 486 -97 816 -130 1320 -130 383 -1 517 7 845 49 1372 176 2726 781 3982 1781 517 411 1037 915 1406 1362 l78 93 -27 32 c-463 555 -984 1081 -1491 1504 -1537 1283 -3211 1885 -4953 1782z m464 -584 c362 -42 679 -139 1002 -304 957 -491 1538 -1464 1501 -2511 -22 -585 -223 -1125 -593 -1590 -87 -109 -314 -336 -424 -424 -403 -322 -876 -525 -1410 -607 -214 -33 -590 -33 -810 0 -560 83 -1055 305 -1470 656 -119 101 -310 302 -403 423 -298 389 -481 840 -542 1332 -30 243 -15 583 35 831 237 1162 1221 2047 2440 2193 160 19 514 20 674 1z"/><path d="M6325 4819 c-557 -58 -1040 -395 -1274 -889 -180 -380 -196 -802 -47 -1188 166 -430 522 -771 959 -917 203 -68 276 -79 527 -79 212 0 232 1 345 28 147 34 230 64 360 126 437 210 750 611 852 1090 28 130 25 469 -4 600 -58 259 -165 475 -334 677 -331 394 -863 606 -1384 552z"/></g></svg>';
			}else{
				document.getElementById("sevicioname").innerHTML = servicio;
				document.getElementById("dialog-log-mensaje").innerHTML = atob(data.mensaje);
				document.getElementById("frm_descargar").action += servicio;				
				openDialog('dialog-log');
				document.getElementById("log_" + fl).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 662" width="18" height="18" style="position: relative; top: 2px;" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(0.000000,662.000000) scale(0.100000,-0.100000)" fill="#FFF" stroke="none"><path d="M6330 6609 c-1718 -102 -3518 -884 -5200 -2260 -336 -274 -685 -593 -956 -873 l-173 -178 91 -99 c144 -156 523 -517 803 -764 1394 -1232 2845 -2012 4275 -2299 486 -97 816 -130 1320 -130 383 -1 517 7 845 49 1372 176 2726 781 3982 1781 517 411 1037 915 1406 1362 l78 93 -27 32 c-463 555 -984 1081 -1491 1504 -1537 1283 -3211 1885 -4953 1782z m464 -584 c362 -42 679 -139 1002 -304 957 -491 1538 -1464 1501 -2511 -22 -585 -223 -1125 -593 -1590 -87 -109 -314 -336 -424 -424 -403 -322 -876 -525 -1410 -607 -214 -33 -590 -33 -810 0 -560 83 -1055 305 -1470 656 -119 101 -310 302 -403 423 -298 389 -481 840 -542 1332 -30 243 -15 583 35 831 237 1162 1221 2047 2440 2193 160 19 514 20 674 1z"/><path d="M6325 4819 c-557 -58 -1040 -395 -1274 -889 -180 -380 -196 -802 -47 -1188 166 -430 522 -771 959 -917 203 -68 276 -79 527 -79 212 0 232 1 345 28 147 34 230 64 360 126 437 210 750 611 852 1090 28 130 25 469 -4 600 -58 259 -165 475 -334 677 -331 394 -863 606 -1384 552z"/></g></svg>';
			}
		},true).obtenResultado();
	}	
}

function ined_Servicio(fl,id,accion){
	if(!document.getElementById("load_acc_" + fl)){
		let imgBuff = document.getElementById("acc_" + fl).innerHTML;
		document.getElementById("acc_" + fl).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="load_acc_'+fl+'" style="position: relative; top: 2px;" width="24" height="24" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><path d="M10 50A40 40 0 0 0 90 50A40 46 0 0 1 10 50" fill="#FFF" stroke="none"><animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 51;360 50 51"></animateTransform></path></svg>';
		if(waitServicio.length == 0){
			waitServicio.push({lf:fl, di:id, noicca:accion});
			putServicio(fl,id,accion);
		}
		else
			waitServicio.push({lf:fl, di:id, noicca:accion});
	}	
}

function putServicio(fl,id,accion){
	new Ajax("PUT","/muldok/app/ined/"+accion+"/"+id,"", resp =>{
		let data = JSON.parse(resp);
		waitServicio.splice(0, 1);
		if(data.estado != 0){
			document.getElementById("dialog-alert-mensaje").innerHTML = data.mensaje;
			openDialog('dialog-alert');
			document.getElementById("acc_" + fl).innerHTML = imgBuff;
		}else{
			if(data.containers){
				if(data.containers[0] != "")
					changeStatus(fl,JSON.parse(data.containers[0]));
				else
					document.getElementById("fila_"+fl).remove();
				}
			}

		if(waitServicio.length > 0)
			putServicio(waitServicio[0].lf,waitServicio[0].di,waitServicio[0].noicca);

	},true).obtenResultado();
}

function changeStatus(fl,container){
	let btnAccion = ""; 
	let clasesAccion = "btn";
	let btntitle = "";
	let btnEliminarC = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#FFF" style="position: relative; top: 2px;" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M16 6l-1.5-1.5h-7L8 6M4 7v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7"></path></svg>';
	let colorTxtState = 'color: ';
	let accionbtn = "";
	let ojinio = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 662" width="18" height="18" style="position: relative; top: 2px;" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(0.000000,662.000000) scale(0.100000,-0.100000)" fill="#FFF" stroke="none"><path d="M6330 6609 c-1718 -102 -3518 -884 -5200 -2260 -336 -274 -685 -593 -956 -873 l-173 -178 91 -99 c144 -156 523 -517 803 -764 1394 -1232 2845 -2012 4275 -2299 486 -97 816 -130 1320 -130 383 -1 517 7 845 49 1372 176 2726 781 3982 1781 517 411 1037 915 1406 1362 l78 93 -27 32 c-463 555 -984 1081 -1491 1504 -1537 1283 -3211 1885 -4953 1782z m464 -584 c362 -42 679 -139 1002 -304 957 -491 1538 -1464 1501 -2511 -22 -585 -223 -1125 -593 -1590 -87 -109 -314 -336 -424 -424 -403 -322 -876 -525 -1410 -607 -214 -33 -590 -33 -810 0 -560 83 -1055 305 -1470 656 -119 101 -310 302 -403 423 -298 389 -481 840 -542 1332 -30 243 -15 583 35 831 237 1162 1221 2047 2440 2193 160 19 514 20 674 1z"/><path d="M6325 4819 c-557 -58 -1040 -395 -1274 -889 -180 -380 -196 -802 -47 -1188 166 -430 522 -771 959 -917 203 -68 276 -79 527 -79 212 0 232 1 345 28 147 34 230 64 360 126 437 210 750 611 852 1090 28 130 25 469 -4 600 -58 259 -165 475 -334 677 -331 394 -863 606 -1384 552z"/></g></svg>';
	if(container.State == "exited" || container.State == "created"){
		 btnAccion = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#FFF" style="position: relative; top: 2px;"><path d="M8 5v14l11-7z"/></svg>';
		 btntitle = "Click para Iniciar";
		  colorTxtState = 'color:  #678cac;';
		  accionbtn = "start";
		  
	}else{
		btnAccion = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFF" style="position: relative; top: 2px;"><path d="M6 6h12v12H6z"/></svg>';
		clasesAccion += " btn-stop";	
		btntitle = "Click para Detener";
		colorTxtState = 'color:  #007bff;';
		accionbtn = "stop";
	}
	
	document.querySelectorAll("#fila_"+fl+" td")[0].innerHTML = "<a href=\"#\" id=\"log_"+fl+"\" onClick=\"verlog('"+fl+"','"+container.Image+"')\" class=\"btn btn-log\" style='padding: 6px 8px; position: relative; top: -3px;' title = 'Click para ver Log'>"+ojinio+"</a> <a href=\"#\" id=\"del_"+fl+"\" onClick=\"deleteServicio('"+fl+"','"+container.ID+"','"+container.Image+"')\" class=\"btn btn-danger\" style='padding: 6px 8px; position: relative; top: -3px;' title = 'Click para Eliminar'>"+btnEliminarC+"</a> <a href=\"#\" onClick=\"ined_Servicio('"+fl+"','"+container.ID+"','"+accionbtn+"')\" class=\""+clasesAccion+"\" style='padding: 3px 5px;' title = '"+btntitle+"' id=\"acc_"+fl+"\">"+btnAccion+"</a>";
	document.querySelectorAll("#fila_"+fl+" td")[3].title = container.Status;	
	document.querySelectorAll("#fila_"+fl+" td")[3].style = colorTxtState + " text-align: center; cursor: pointer"; 
	document.querySelectorAll("#fila_"+fl+" td")[3].innerHTML = "<b>"+container.State+"</b>";
}

function deleteServicio(fl,id,nombre){
	if(!document.getElementById("load_del_" + fl)){
		document.getElementById("dialog-confirm-mensaje").innerHTML = "Seguro de eliminar servicio: <b>" + nombre + "</b>";
		document.getElementById("dialog-confirm-btnOk").onclick = function (){ 
			document.getElementById("del_" + fl).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="load_del_'+fl+'" style="position: relative; top: 2px;" width="18" height="18" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><path d="M10 50A40 40 0 0 0 90 50A40 46 0 0 1 10 50" fill="#FFF" stroke="none"><animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 51;360 50 51"></animateTransform></path></svg>';
			closeDialog('dialog-confirm');
			let param = {image:nombre};
			new Ajax("DELETE","/muldok/app/servicio/"+id,JSON.stringify(param),resp =>{
				let data = JSON.parse(resp);
				if(data.estado != 0){
					document.getElementById("dialog-alert-mensaje").innerHTML = data.mensaje;
					openDialog('dialog-alert');
					document.getElementById("del_" + fl).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#FFF" style="position: relative; top: 2px;" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M16 6l-1.5-1.5h-7L8 6M4 7v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7"></path></svg>';
				}else{
					new Ajax("GET","/registry/del/"+nombre,"",resp =>{
						let data = JSON.parse(resp);
						if(data.estado != 0){
							document.getElementById("dialog-alert-mensaje").innerHTML = data.mensaje;
							openDialog('dialog-alert');
							document.getElementById("del_" + fl).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#FFF" style="position: relative; top: 2px;" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M16 6l-1.5-1.5h-7L8 6M4 7v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7"></path></svg>';
						}else{
							document.getElementById("fila_"+fl).remove();
						}
					},true).obtenResultado();
				}
			},true).obtenResultado();
		};
		openDialog('dialog-confirm');
	}	
}