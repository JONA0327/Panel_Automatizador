<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;

class ProductoController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Retorna la vista con el formulario para crear producto
        return view('productos.create');
    }

    /**
     * Store a newly created resource in storage.
     */
   public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'      => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio'      => 'required|numeric',
            'moneda'      => 'required|string|max:10',
            'categoria'   => 'nullable|string|max:255',
            'imagenes'    => 'nullable|array',
            'imagenes.*'  => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $imagenes = [];
        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $img) {
                $mime = $img->getClientMimeType();
                $base64 = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($img->getRealPath()));
                $imagenes[] = $base64;
            }
        }
        $validated['imagenes'] = $imagenes;

        $producto = Producto::create($validated);

        // Devuelve JSON con status 201 para que React no trate de parsear HTML
        return response()->json([
            'message'  => 'Producto creado correctamente',
            'producto' => $producto,
        ], 201);
    }
    // Resto de métodos omitidos para no abultar
    public function index(Request $request)
    {
        $productos = Producto::all();
        // Si espera JSON (fetch de React), responde JSON. Si es navegador, devuelve vista.
        if ($request->expectsJson() || $request->wantsJson()) {
            return response()->json($productos);
        }
        return view('welcome', compact('productos'));
    }


    public function show($id)
    {
        $producto = Producto::find($id);
        if (!$producto) {
            return redirect()->route('productos.index')->withErrors('Producto no encontrado');
        }
        return view('productos.show', compact('producto'));
    }

    public function edit($id)
    {
        $producto = Producto::find($id);
        return view('productos.edit', compact('producto'));
    }

    public function update(Request $request, $id)
    {
        // Similar a store(), pero actualizando
        $validatedData = $request->validate([
            'nombre'      => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio'      => 'required|numeric',
            'moneda'      => 'required|string|max:10',
            'categoria'   => 'nullable|string|max:255',
            'imagenes'    => 'nullable|array',
            'imagenes.*'  => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $producto = Producto::find($id);
        if (!$producto) {
            return redirect()->route('productos.index')->withErrors('Producto no encontrado');
        }

        // Procesar las nuevas imágenes (si las hay) y concatenar con las anteriores
        $imagenesActuales = $producto->imagenes ?? [];
        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $imagen) {
                $mime = $imagen->getClientMimeType();
                $base64 = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($imagen->getRealPath()));
                $imagenesActuales[] = $base64;
            }
        }
        $validatedData['imagenes'] = $imagenesActuales;

        $producto->fill($validatedData);
        $producto->save();

            return response()->json(['message' => 'Producto actualizado correctamente.']);

    }

    public function destroy($id)
    {
        $producto = Producto::find($id);
        if ($producto) {
            // Almacenar las imágenes en la base, por lo que no hay archivos que eliminar
            $producto->delete();
        }
        return response()->json(['message' => 'Producto eliminado correctamente.']);
    }


}
