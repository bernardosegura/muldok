<?php
//++++Se activan los errores por si el servidor los tiene deshabilitados.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
//---------------------------------------------------------------------

$url = 'http://localhost:3000/cifradorsa:0.0.1/cifrado';
$num_multiplicar = isset($_GET['numero'])?(is_numeric($_GET['numero'])?$_GET['numero']:0):0;

//Ciframos con la llave Pública en el archivo pem de tipo certificado, se puede manejar cualquier extensión mientras el archivo sea pem (llave leible por openssl). 
openssl_public_encrypt($num_multiplicar, $getConexion, openssl_pkey_get_public(file_get_contents('cifrado.cer')));
$getConexion = base64_encode($getConexion);

echo "<b>Número a Cifrar:</b> $num_multiplicar <br><br>";
echo "<b>Número Cifrado:</b> ".$getConexion."<br><br>";

$curl = curl_init($url);
curl_setopt($curl, CURLOPT_HTTPHEADER,  array(
      'Content-Type: application/json',
      'Authorization: ' . $getConexion,
  ));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($curl);
curl_close($curl);

$data = new stdClass();

if ($response === false) {
    $error = curl_error($curl);
    $data->mensaje = "Error en la solicitud: " . $error;
    $data->estado = -1;
    $data->resultado = "";
    var_dump($data);
    exit(0);
}else{
  $data = json_decode($response);
  $data->mensaje = "OK";
  $data->estado = 0;

  echo "<b>Resultado Cifrado:</b> ".$data->resultado." <br><br>";

  //Decodificamos con la llave Privada de el archivo pem de tipo ctr, se puede manejar cualquier extensión mientras el archivo sea pem (llave leible por openssl). 
  openssl_private_decrypt(base64_decode($data->resultado), $dato, openssl_pkey_get_private(file_get_contents('cifrado.ctr'),"php-mulesoft"));
   //echo openssl_error_string();
    echo "<b>Resultado x2:</b> ".$dato;
  } 

?>
