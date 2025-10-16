import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Configuración de Supabase
const supabaseUrl = 'https://iymqxetynnfhnkwbsypv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bXF4ZXR5bm5maG5rd2JzeXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjE0OTAsImV4cCI6MjA3NjEzNzQ5MH0.FC-WTwnANrkdPnKmgccdvQADh_OxXGKg941lkbsupjs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarYCorregirAdmin() {
  try {
    console.log('🔍 Buscando administrador...');
    
    // Buscar el administrador
    const { data: admin, error: searchError } = await supabase
      .from('administradores')
      .select('*')
      .eq('correo', 'admin@monteluz.com')
      .single();
    
    if (searchError) {
      console.error('❌ Error al buscar administrador:', searchError);
      return;
    }
    
    if (!admin) {
      console.log('❌ No se encontró el administrador');
      return;
    }
    
    console.log('✅ Administrador encontrado:', {
      id: admin.id,
      nombre: admin.nombre,
      apellidos: admin.apellidos,
      correo: admin.correo,
      estado: admin.estado
    });
    
    console.log('🔐 Contraseña actual en BD:', admin.contraseña);
    
    // Generar nueva contraseña encriptada para admin123
    const nuevaContraseña = await bcrypt.hash('admin123', 10);
    console.log('🔐 Nueva contraseña encriptada:', nuevaContraseña);
    
    // Actualizar la contraseña
    const { error: updateError } = await supabase
      .from('administradores')
      .update({ contraseña: nuevaContraseña })
      .eq('correo', 'admin@monteluz.com');
    
    if (updateError) {
      console.error('❌ Error al actualizar contraseña:', updateError);
      return;
    }
    
    console.log('✅ Contraseña actualizada exitosamente');
    
    // Verificar que la contraseña funciona
    const contraseñaValida = await bcrypt.compare('admin123', nuevaContraseña);
    console.log('🧪 Verificación de contraseña:', contraseñaValida ? '✅ VÁLIDA' : '❌ INVÁLIDA');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verificarYCorregirAdmin();
