<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Gestión de Paquetes - 4Life</title>
    @vite(['resources/css/app.css', 'resources/js/PackageApp.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
