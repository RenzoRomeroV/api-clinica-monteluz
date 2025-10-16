import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Configuración de Supabase
const supabaseUrl = 'https://iymqxetynnfhnkwbsypv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bXF4ZXR5bm5maG5rd2JzeXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjE0OTAsImV4cCI6MjA3NjEzNzQ5MH0.FC-WTwnANrkdPnKmgccdvQADh_OxXGKg941lkbsupjs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function crearAdministrador() {
  try {
    console.log('🔗 Conectando a Supabase...');
    
    // Encriptar contraseña
    const contraseñaEncriptada = await bcrypt.hash('admin123', 10);
    console.log('🔐 Contraseña encriptada:', contraseñaEncriptada);
    
    // Crear administrador
    const { data, error } = await supabase
      .from('administradores')
      .insert([
        {
          dni: '12345678',
          nombre: 'Admin',
          apellidos: 'Sistema',
          fecha_nacimiento: '1990-01-01',
          correo: 'admin@monteluz.com',
          contraseña: contraseñaEncriptada,
          direccion: 'Lima, Perú',
          departamento: 'Lima',
          provincia: 'Lima',
          distrito: 'Miraflores',
          estado: 1
        }
      ])
      .select();
    
    if (error) {
      console.error('❌ Error al crear administrador:', error);
      return;
    }
    
    console.log('✅ Administrador creado exitosamente:', data);
    
    // Verificar que la contraseña funciona
    const contraseñaValida = await bcrypt.compare('admin123', contraseñaEncriptada);
    console.log('🧪 Verificación de contraseña:', contraseñaValida ? '✅ VÁLIDA' : '❌ INVÁLIDA');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

crearAdministrador();

