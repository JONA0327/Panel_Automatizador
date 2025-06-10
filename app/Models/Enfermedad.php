<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Enfermedad extends Model
{
    protected $collection = 'enfermedades';
    protected $connection = 'mongodb';

    protected $fillable = [
        'nombre',
        'descripcion',
        'paquete_id',
        'dosis', // array de { producto_id, dosis }
    ];

    protected $casts = [
        'dosis' => 'array',
    ];
}
