<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Producto extends Model
{
    // Si tu colección se llama distinto a “productos”, define:
    protected $collection = 'productos';

    // Por defecto, usa la conexión ‘mongodb’. Si necesitas otro nombre:
    protected $connection = 'mongodb';

    protected $fillable = [
        'nombre',        // Nombre del producto
        'descripcion',   // Descripción del producto
        'precio',        // Precio
        'moneda',        // Moneda (e.g., Pesos)
        'categoria',     // Categoría
        'imagenes',      // Imágenes

    ];
}
