// import { withAuth } from '../../../lib/middleware';
// import { ApiResponse, ExtendedNextApiRequest } from '../../../app/types/api';

interface SessionData {
    userId?: string;
}

export default defineEventHandler(async (event) => {
  try {
    const session = await getSession<SessionData>(event, {
      name: 'nuxt-session',
      password: process.env.SESSION_SECRET || 'super-secret-key'
    });
    
    return {
      success: true,
      data: {
        logged: !!session.data?.userId,
        user: event.context.auth?.user || null
      }
    };
  } catch (error) {
    console.error("Error al verificar autenticación:", error);
    return {
      success: true,
      data: {
        logged: false,
        user: null
      }
    };
  }
});
