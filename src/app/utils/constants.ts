/*
Contenedor de constantes
*/


// Input tipo telefono
export const MAX_PHONE_LEN = 20;
export const PHONE_ALLOWED_REGEX = /^[0-9A-Za-z\-.\(\)\+\s]*$/;

// Input tipo descripcion/textarea
export const MAX_DESCRIPTION_LEN = 300;
export const DESCRIPTION_ALLOWED_REGEX = /^[\s\S]*$/; 

// Input tipo imagen
export const ALLOWED_MIME = new Set(['image/png', 'image/jpeg']);
export const ALLOWED_EXT  = new Set(['png', 'jpg', 'jpeg']);
export const MIN_WIDTH = 128;
export const MIN_HEIGHT = 128;
export const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2MB
