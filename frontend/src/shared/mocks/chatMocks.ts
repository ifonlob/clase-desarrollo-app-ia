import type { ChatMessage } from '@/shared/types/chat.types'

export const CHAT_MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'mock-1',
    role: 'assistant',
    content:
      'He consultado el tiempo para Madrid. Hoy el cielo está despejado con 22°C y humedad del 45%. Perfectas condiciones para explorar la ciudad.',
    toolCalls: [
      {
        toolName: 'weather_search',
        input: 'tiempo Madrid hoy',
        output: '{"city":"Madrid","temp_c":22,"condition":"soleado","humidity":45,"wind_kmh":12}',
        durationMs: 342,
      },
    ],
    timestamp: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    role: 'assistant',
    content:
      'He buscado vuelos Madrid-Roma para junio. Vueling ofrece vuelos desde 89€ ida. Alojamiento en Trastevere desde 85€/noche.',
    toolCalls: [
      {
        toolName: 'travel_search',
        input: 'vuelos y hoteles Madrid-Roma junio',
        output:
          '{"flights":[{"airline":"Vueling","price_eur":89}],"hotels":[{"name":"Hotel Trastevere","price_eur":85,"rating":8.4}]}',
        durationMs: 687,
      },
    ],
    timestamp: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    role: 'assistant',
    content:
      'La Alhambra recibe más de 2,5 millones de visitantes anuales. Entradas: 14€. Se recomienda reservar con al menos 2 semanas de antelación.',
    toolCalls: [
      {
        toolName: 'faq_vector_search',
        input: 'información Alhambra Granada',
        output:
          '[{"score":0.94,"text":"La Alhambra recibe >2.5M visitantes/año. Entradas: 14€. Reserva anticipada obligatoria."}]',
        durationMs: 198,
      },
    ],
    timestamp: new Date().toISOString(),
  },
  {
    id: 'mock-4',
    role: 'assistant',
    content:
      'He encontrado información sobre el GR-11 en los Pirineos. Es una ruta de alta dificultad de 820 km que atraviesa el Pirineo de este a oeste.',
    toolCalls: [
      {
        toolName: 'web_search',
        input: 'ruta GR-11 Pirineos dificultad distancia',
        output:
          'GR-11: 820 km, alta dificultad, ~50 etapas. Cruza de Cap de Creus a Hondarribia. Fuente: senderos.es',
        durationMs: 521,
      },
    ],
    timestamp: new Date().toISOString(),
  },
  {
    id: 'mock-5',
    role: 'assistant',
    content:
      '¡Hola! Soy tu asistente de viajes. Puedo consultar el tiempo, buscar vuelos y hoteles, informarte sobre monumentos y realizar búsquedas en internet. ¿En qué puedo ayudarte?',
    toolCalls: [],
    timestamp: new Date().toISOString(),
  },
]
