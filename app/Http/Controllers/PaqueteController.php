<?php

namespace App\Http\Controllers;

use App\Models\Paquete;
use App\Models\Producto;
use Illuminate\Http\Request;

class PaqueteController extends Controller
{
    public function index()
    {
        try {
            $paquetes = Paquete::all();

            // Adjuntar la información de los productos a cada paquete
            $paquetes->transform(function ($paquete) {
                $ids = is_array($paquete->productos)
                    ? $paquete->productos
                    : json_decode($paquete->productos, true);

                $paquete->productos_detalle = Producto::whereIn('_id', $ids)->get();
                return $paquete;
            });

            return response()->json($paquetes);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener paquetes'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'descripcion' => 'required|string',
                'precio_total' => 'required|numeric|min:0',
                'productos' => 'required|array|min:1',
                'productos.*' => 'string', // IDs de productos
                'descuento' => 'nullable|numeric|min:0|max:100',
                'moneda' => 'required|string|max:10',
            ]);

            $paquete = Paquete::create($validated);
            return response()->json($paquete, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al crear paquete: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $paquete = Paquete::findOrFail($id);

            $ids = is_array($paquete->productos)
                ? $paquete->productos
                : json_decode($paquete->productos, true);

            $paquete->productos_detalle = Producto::whereIn('_id', $ids)->get();

            return response()->json($paquete);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Paquete no encontrado'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $paquete = Paquete::findOrFail($id);

            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'descripcion' => 'required|string',
                'precio_total' => 'required|numeric|min:0',
                'productos' => 'required|array|min:1',
                'productos.*' => 'string',
                'descuento' => 'nullable|numeric|min:0|max:100',
                'moneda' => 'required|string|max:10',
            ]);

            $paquete->update($validated);
            return response()->json($paquete);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar paquete: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $paquete = Paquete::findOrFail($id);
            $paquete->delete();
            return response()->json(['message' => 'Paquete eliminado correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar paquete'], 500);
        }
    }
}
