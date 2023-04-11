import openai
import json

# Establecer la clave de API de OpenAI
openai.api_key = "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"

# Función para enviar una solicitud a la API de OpenAI y recibir una respuesta
def generar_respuesta(prompt):
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=60,
        n=1,
        stop=None,
        temperature=0.5,
    )
    message = response.choices[0].text.strip()
    return message

# Ejemplo de uso
prompt = "Hola, ¿cómo estás?"
response = generar_respuesta(prompt)
print(response)