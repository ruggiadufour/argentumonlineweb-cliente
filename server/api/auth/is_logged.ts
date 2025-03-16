// import { withAuth } from '../../../lib/middleware';
// import { ApiResponse, ExtendedNextApiRequest } from '../../../app/types/api';

interface SessionData {
    userId?: string;
}

export default defineEventHandler(async (event) => {
  try {
    
    return {
      success: true,
      data: {
        logged: !!event.context.auth?.user,
        user: event.context.auth?.user || null
      }
    };
  } catch (error) {
    console.error("Error al verificar autenticación:", error);
    throw createError({
      statusCode: 500,
      message: "Error interno del servidor"
    });
  }
});
