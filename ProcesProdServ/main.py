import json
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import re
import sqlite3
import openai
import timeit

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

def pregunta(prompt):
    openai.api_key = "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"

    completion = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        max_tokens=2048
    )

    response_text = completion.choices[0].text
    return response_text

def extract_keys_and_values(json_obj):
    keys = list(json_obj.keys())
    values = list(json_obj.values())
    return keys, values

def create_prompt(column_names, first_values):
    prompt = "Tengo un archivo CSV con las siguientes columnas y valores, (las columnas son una unica palabra a la derecha y los valores pueden ser varias palabras a la izquierda):\n\n"
    prompt += f"Columnas: Valores\n"
    for column_name, first_value in zip(column_names, first_values):
        if first_value not in (None, ""):
            prompt += f"{column_name}: {first_value}\n"
    prompt += "\n¿Cuáles columnas corresponden a las siguientes categorías del modelo: nombre, unidad, cantidad, precio, proveedor y especificacion?, La respuesta debe tener el siguiente formato"
    prompt += "\nnombre: nombre columna correspondiente del csv"
    prompt += "\nunidad: nombre columna correspondiente del csv"
    prompt += "\ncantidad: nombre columna correspondiente del csv"
    prompt += "\nprecio: nombre columna correspondiente del csv"
    prompt += "\nproveedor: nombre columna correspondiente del csv"
    prompt += "\nespecificacion: nombre columna correspondiente del csv"
    prompt += "\npuede ocurrir que el modelo sea igual que las columnas entonces las lineas quedarian asi X: X, Y: Y, Z: Z, P: P"

    return prompt

def get_column_equivalences_from_openai(column_names, first_values):
    prompt = create_prompt(column_names, first_values)
    response_text = pregunta(prompt)
    # Procesar la respuesta y extraer las equivalencias de las columnas
    column_equivalences = {}
    lines = response_text.split('\n')
    for line in lines:
        match = re.match(r'(\w+):\s+(\w+)', line, re.IGNORECASE)
        if match:
            column_name, csv_column_name = match.groups()
            column_equivalences[column_name.lower()] = column_names.index(csv_column_name.lower())

    return column_equivalences

def transformar_diccionario(diccionario, tabla_correspondencias):
    nuevo_diccionario = {}
    correspondencias_invertidas = {v: k for k, v in tabla_correspondencias.items()}

    for i in range(len(diccionario)):
        if i in correspondencias_invertidas:
            nuevo_diccionario[correspondencias_invertidas[i]] = diccionario[list(diccionario.keys())[i]]

    return nuevo_diccionario

# Función para validar reglas de negocio
def validate_business_rules(item):
    special_characters_pattern = re.compile(r'[^\w\s]+')  # Aceptar espacios en cliente y objeto

    # Regla de negocio: asegurar que ningún campo esté vacío
    if not all(item.values()):
        return None

    # Regla de negocio: nombre, proveedor y especificacion deben ser texto sin caracteres especiales
    if (special_characters_pattern.search(item['nombre']) or
            special_characters_pattern.search(item['proveedor']) or
                special_characters_pattern.search(item['especificacion'])):
        return None

    # Regla de negocio: cantidad y precio deben ser números
    try:
        item['cantidad'] = int(item['cantidad'])
        item['precio'] = float(item['precio'])
    except ValueError:
        return None

    return item

import sqlite3

# Función para guardar JSON en una tabla SQLite
def json_to_sqlite(item, tipo):
    conn = sqlite3.connect("C:\\Users\\Luis Castro\\Documents\\ARTI\\Tienda Ropa MATI\\ProcesProdServ\\mati.db")
    cursor = conn.cursor()

    # Crear tabla si no existe
    cursor.execute(f'''CREATE TABLE IF NOT EXISTS {"mati_table"} (
                            nombre TEXT,
                            unidad TEXT,
                            cantidad INTEGER,
                            precio REAL,
                            proveedor TEXT,
                            especificacion TEXT,
                            tipo TEXT
                            )''')

    # Insertar el objeto JSON en la tabla
    cursor.execute(f'''INSERT INTO {"mati_table"} (nombre, unidad, cantidad, precio, proveedor, especificacion, tipo)
                                VALUES (?, ?, ?, ?, ?, ?, ?)''',
                   (item['nombre'], item['unidad'], item['cantidad'], item['precio'], item['proveedor'], item['especificacion'], tipo))

    # Confirmar cambios y cerrar la conexión
    conn.commit()
    conn.close()

    socketio.emit('database_update', {'data': 'Database updated'})

def get_type(data):
    response_text = pregunta("esto es un producto o servicio?, solo responde la palabra SERVICIO O PRODUCTO EN MAYUSCULAS"+json.dumps((data)))
    type = response_text.replace(" ", "").replace("\n", "")
    return type

@app.route("/process", methods=["POST"])
def process_data():
    data = request.json
    keys, values = extract_keys_and_values(data)
    start_time = timeit.default_timer()
    equivalencies = get_column_equivalences_from_openai(keys, values)
    rta = transformar_diccionario(data, equivalencies)
    type = get_type(data)
    if (validate_business_rules(rta) == None):
        end_time = timeit.default_timer()
        elapsed_time = end_time - start_time  # Calcula el tiempo transcurrido
        print(f"Tiempo transcurrido: {elapsed_time:.6f} segundos")
        return jsonify({"error":"reglas de negocio invalidas"})
    json_to_sqlite(rta, type)
    end_time = timeit.default_timer()
    elapsed_time = end_time - start_time  # Calcula el tiempo transcurrido
    print(f"Tiempo transcurrido: {elapsed_time:.6f} segundos")
    return jsonify(rta)

if __name__ == "__main__":
    socketio.run(app)
