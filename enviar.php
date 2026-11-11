<?php
/**
 * Envío del formulario de contacto por correo electrónico.
 *
 * Funciona en el hosting cPanel con la función mail() de PHP.
 * CONFIGURACIÓN: cambia las dos direcciones de abajo.
 *  - DESTINO: casilla donde quieres recibir los mensajes.
 *  - REMITENTE: debe ser una casilla creada en el mismo dominio (cPanel > Cuentas de correo),
 *    de lo contrario el correo puede llegar a la carpeta de spam o ser rechazado.
 */
const DESTINO   = 'contacto@elpuebloconsuazo.cl';
const REMITENTE = 'no-responder@elpuebloconsuazo.cl';
const ASUNTO    = 'Nuevo mensaje desde elpuebloconsuazo.cl';

header('Content-Type: application/json; charset=utf-8');

function responder(int $codigo, bool $ok, string $mensaje): void {
    http_response_code($codigo);
    echo json_encode(['ok' => $ok, 'mensaje' => $mensaje], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    responder(405, false, 'Método no permitido.');
}

// Campo trampa: si un robot lo completa, fingimos éxito y no enviamos nada.
if (!empty($_POST['sitio'])) {
    responder(200, true, 'Mensaje enviado.');
}

function limpiar(string $clave, int $largo): string {
    $valor = trim((string)($_POST[$clave] ?? ''));
    $valor = str_replace(["\r", "\0"], '', $valor);
    return mb_substr($valor, 0, $largo);
}

$nombre   = limpiar('nombre', 100);
$correo   = limpiar('correo', 150);
$telefono = limpiar('telefono', 30);
$sector   = limpiar('sector', 100);
$motivo   = limpiar('motivo', 100);
$mensaje  = limpiar('mensaje', 3000);

// Los campos de una línea no pueden tener saltos (evita inyección de cabeceras).
foreach ([$nombre, $correo, $telefono, $sector, $motivo] as $v) {
    if (strpos($v, "\n") !== false) {
        responder(400, false, 'Datos no válidos.');
    }
}

if (mb_strlen($nombre) < 2) {
    responder(422, false, 'Escribe tu nombre.');
}
if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    responder(422, false, 'Escribe un correo electrónico válido.');
}
if (mb_strlen($mensaje) < 10) {
    responder(422, false, 'El mensaje debe tener al menos 10 caracteres.');
}

$cuerpo  = "Nuevo mensaje recibido desde el sitio web\n";
$cuerpo .= "==========================================\n\n";
$cuerpo .= "Nombre:   {$nombre}\n";
$cuerpo .= "Correo:   {$correo}\n";
$cuerpo .= "Teléfono: " . ($telefono !== '' ? $telefono : '—') . "\n";
$cuerpo .= "Sector:   " . ($sector !== '' ? $sector : '—') . "\n";
$cuerpo .= "Motivo:   {$motivo}\n\n";
$cuerpo .= "Mensaje:\n{$mensaje}\n\n";
$cuerpo .= "------------------------------------------\n";
$cuerpo .= 'Enviado el ' . date('d-m-Y H:i') . "\n";

$cabeceras = [
    'From: Sitio web Suazo <' . REMITENTE . '>',
    'Reply-To: ' . $correo,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];

$asunto = '=?UTF-8?B?' . base64_encode(ASUNTO) . '?=';

if (mail(DESTINO, $asunto, $cuerpo, implode("\r\n", $cabeceras), '-f' . REMITENTE)) {
    responder(200, true, 'Mensaje enviado.');
}

responder(500, false, 'No pudimos enviar el mensaje. Inténtalo más tarde.');
