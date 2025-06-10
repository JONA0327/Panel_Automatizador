<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Paquete extends Model
{
    protected $collection = 'paquetes';
    protected $connection = 'mongodb';

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio_total',
        'productos',  // Array de IDs de productos
        'descuento',
        'moneda',
    ];

    protected $casts = [
        'productos' => 'array',
        'precio_total' => 'decimal:2',
        'descuento' => 'decimal:2',
    ];
}
