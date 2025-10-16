import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://iymqxetynnfhnkwbsypv.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bXF4ZXR5bm5mZmt3YnN5cHYiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzA0NzQwMCwiZXhwIjoyMDUyNjIzNDAwfQ.placeholder';

console.log('🔗 Conectando a Supabase:', supabaseUrl);

// Cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Función para verificar la conexión
export const verificarConexion = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    console.log('✅ Conexión a Supabase establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con Supabase:', error.message);
    return false;
  }
};

export default supabase;




