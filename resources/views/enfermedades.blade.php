<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Índice de Enfermedades</title>
    @vite(['resources/css/app.css', 'resources/js/DiseaseApp.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
