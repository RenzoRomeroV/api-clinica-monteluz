import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

console.log('🔧 Probando conexión con Supabase...\n');
console.log('URL:', supabaseUrl);
console.log('Key configurada:', supabaseKey ? 'Sí' : 'No');
console.log('Service Key configurada:', supabaseServiceKey ? 'Sí' : 'No');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  console.log('💡 Por favor, actualiza el archivo config.env con las claves correctas');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    console.log('\n🔄 Probando conexión básica...');
    
    // Probar conexión con tabla administradores
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('administradores')
      .select('count', { count: 'exact', head: true });
    
    if (adminError) {
      console.error('❌ Error con tabla administradores:', adminError.message);
      return false;
    }
    
    console.log('✅ Tabla administradores accesible');
    
    // Probar conexión con tabla usuarios
    const { data: userData, error: userError } = await supabaseAdmin
      .from('usuarios')
      .select('count', { count: 'exact', head: true });
    
    if (userError) {
      console.error('❌ Error con tabla usuarios:', userError.message);
      return false;
    }
    
    console.log('✅ Tabla usuarios accesible');
    
    // Probar conexión con tabla doctores
    const { data: doctorData, error: doctorError } = await supabaseAdmin
      .from('doctores')
      .select('count', { count: 'exact', head: true });
    
    if (doctorError) {
      console.error('❌ Error con tabla doctores:', doctorError.message);
      return false;
    }
    
    console.log('✅ Tabla doctores accesible');
    
    // Probar conexión con tabla especialidades
    const { data: especialidadData, error: especialidadError } = await supabaseAdmin
      .from('especialidades')
      .select('count', { count: 'exact', head: true });
    
    if (especialidadError) {
      console.error('❌ Error con tabla especialidades:', especialidadError.message);
      return false;
    }
    
    console.log('✅ Tabla especialidades accesible');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
}

async function testLogin() {
  try {
    console.log('\n🔄 Probando login con administrador...');
    
    // Buscar administrador existente
    const { data: admin, error: adminError } = await supabaseAdmin
      .from('administradores')
      .select('*')
      .eq('correo', 'admin@monteluz.com')
      .eq('estado', 1)
      .single();
    
    if (adminError) {
      console.log('⚠️  No se encontró administrador con email admin@monteluz.com');
      console.log('💡 Esto es normal si no has creado el administrador aún');
      return false;
    }
    
    console.log('✅ Administrador encontrado:', admin.nombre, admin.apellidos);
    console.log('📧 Email:', admin.correo);
    console.log('🔑 Contraseña encriptada:', admin.contraseña.substring(0, 20) + '...');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error probando login:', error.message);
    return false;
  }
}

async function createTestAdmin() {
  try {
    console.log('\n🔄 Creando administrador de prueba...');
    
    // Verificar si ya existe
    const { data: existingAdmin } = await supabaseAdmin
      .from('administradores')
      .select('id')
      .eq('correo', 'admin@monteluz.com')
      .single();
    
    if (existingAdmin) {
      console.log('ℹ️  Administrador ya existe');
      return true;
    }
    
    // Crear administrador de prueba
    const { data, error } = await supabaseAdmin
      .from('administradores')
      .insert([{
        dni: '12345678',
        nombre: 'Administrador',
        apellidos: 'Sistema',
        fecha_nacimiento: '1990-01-01',
        correo: 'admin@monteluz.com',
        contraseña: '$2a$12$rJGtftCyeQyB8WPx8GkFSurNzzFsPOTZEB0.F5jU8Oe1pSIzZ5eV.', // admin123
        direccion: 'Av. Principal 123',
        departamento: 'Lima',
        provincia: 'Lima',
        distrito: 'Miraflores',
        estado: 1
      }])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creando administrador:', error.message);
      return false;
    }
    
    console.log('✅ Administrador creado:', data.nombre, data.apellidos);
    console.log('📧 Email: admin@monteluz.com');
    console.log('🔑 Password: admin123');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error creando administrador:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando pruebas de conexión con Supabase...\n');
  
  // Probar conexión
  const connected = await testConnection();
  if (!connected) {
    console.log('\n❌ No se pudo conectar a Supabase');
    console.log('💡 Verifica que las claves en config.env sean correctas');
    process.exit(1);
  }
  
  // Probar login
  await testLogin();
  
  // Crear administrador de prueba si no existe
  await createTestAdmin();
  
  console.log('\n🎉 ¡Conexión con Supabase exitosa!');
  console.log('✅ Todas las tablas están accesibles');
  console.log('✅ El backend está listo para funcionar');
  console.log('\n💡 Ahora puedes ejecutar: npm run dev');
}

main().catch(console.error);
