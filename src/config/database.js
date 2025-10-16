import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno desde config.env
dotenv.config({ path: './config.env' });

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan variables de entorno de Supabase');
}

// Cliente de Supabase para operaciones públicas
export const supabase = createClient(supabaseUrl, supabaseKey);

// Cliente de Supabase para operaciones administrativas
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Función para probar la conexión
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Error de conexión a Supabase:', error);
      return false;
    }
    
    console.log('✅ Conexión a Supabase exitosa');
    return true;
  } catch (error) {
    console.error('Error de conexión a Supabase:', error);
    return false;
  }
};

// Función para obtener información de la base de datos
export const getDatabaseInfo = async () => {
  try {
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('count', { count: 'exact', head: true });
    
    const { data: especialidades, error: especialidadesError } = await supabase
      .from('especialidades')
      .select('count', { count: 'exact', head: true });
    
    return {
      usuarios: usuariosError ? 0 : usuarios,
      especialidades: especialidadesError ? 0 : especialidades,
      status: 'connected'
    };
  } catch (error) {
    console.error('Error obteniendo información de la base de datos:', error);
    return {
      usuarios: 0,
      especialidades: 0,
      status: 'error',
      error: error.message
    };
  }
};