// Tipo base para respuestas que devuelven "success"
export type SuccessResponse = { success: boolean };

// Respuesta al crear un viaje
export type CreateTripResponse = SuccessResponse & { tripId: number };


// Respuesta al solicitar unirse a un viaje
export type CreateTripRequestResponse = SuccessResponse & { requestId: number };

// Respuesta al añadir un comentario
export type AddCommentResponse = SuccessResponse & { commentId: number };
