<?php

namespace App\Http\Controllers;

use App\Models\Enfermedad;
use App\Models\Paquete;
use App\Models\Producto;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;

class EnfermedadController extends Controller
{
    public function index()
    {
        try {
            $enfermedades = Enfermedad::all();

            $enfermedades->transform(function ($enf) {
                if ($enf->paquete_id) {
                    $paquete = Paquete::find($enf->paquete_id);
                    if ($paquete) {
                        $ids = is_array($paquete->productos)
                            ? $paquete->productos
                            : json_decode($paquete->productos, true);
                        $mongoIds = array_map(fn($id) => new ObjectId($id), $ids);
                        $paquete->productos_detalle = Producto::whereIn('_id', $mongoIds)->get();
                        $enf->paquete = $paquete;
                    }
                }
                return $enf;
            });

            return response()->json($enfermedades);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener enfermedades'], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'paquete_id' => 'required|string',
            'dosis' => 'nullable|array',
        ]);

        $enfermedad = Enfermedad::create($validated);
        return response()->json($enfermedad, 201);
    }

    public function show($id)
    {
        try {
            $enf = Enfermedad::findOrFail($id);
            if ($enf->paquete_id) {
                $paquete = Paquete::find($enf->paquete_id);
                if ($paquete) {
                    $ids = is_array($paquete->productos)
                        ? $paquete->productos
                        : json_decode($paquete->productos, true);
                    $mongoIds = array_map(fn($id) => new ObjectId($id), $ids);
                    $paquete->productos_detalle = Producto::whereIn('_id', $mongoIds)->get();
                    $enf->paquete = $paquete;
                }
            }
            return response()->json($enf);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Enfermedad no encontrada'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $enf = Enfermedad::findOrFail($id);
            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'descripcion' => 'required|string',
                'paquete_id' => 'required|string',
                'dosis' => 'nullable|array',
            ]);
            $enf->update($validated);
            return response()->json($enf);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar enfermedad'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $enf = Enfermedad::findOrFail($id);
            $enf->delete();
            return response()->json(['message' => 'Enfermedad eliminada correctamente']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar enfermedad'], 500);
        }
    }
}
