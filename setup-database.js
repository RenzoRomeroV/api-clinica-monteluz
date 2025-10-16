import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('🔧 Configurando base de datos...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? 'Configurada' : 'No configurada');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔄 Probando conexión...');
    
    // Probar conexión básica
    const { data, error } = await supabase
      .from('usuarios')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Error de conexión:', error.message);
      return false;
    }
    
    console.log('✅ Conexión exitosa');
    console.log('📊 Total de usuarios:', data);
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function createAdminUser() {
  try {
    console.log('👤 Creando usuario administrador...');
    
    // Verificar si ya existe un admin
    const { data: existingAdmin, error: checkError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', 'admin@monteluz.com')
      .single();
    
    if (existingAdmin) {
      console.log('ℹ️  Usuario administrador ya existe');
      return existingAdmin;
    }
    
    // Crear usuario administrador
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        email: 'admin@monteluz.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/9KzKzqK', // password: admin123
        nombre: 'Administrador',
        apellido: 'Sistema',
        rol: 'admin',
        activo: true
      }])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creando admin:', error.message);
      return null;
    }
    
    console.log('✅ Usuario administrador creado:', data.email);
    return data;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Iniciando configuración de base de datos...\n');
  
  // Probar conexión
  const connected = await testConnection();
  if (!connected) {
    console.log('\n❌ No se pudo conectar a la base de datos');
    console.log('💡 Verifica que las variables de entorno estén configuradas correctamente');
    process.exit(1);
  }
  
  // Crear usuario administrador
  await createAdminUser();
  
  console.log('\n✅ Configuración completada');
  console.log('🔑 Credenciales de administrador:');
  console.log('   Email: admin@monteluz.com');
  console.log('   Password: admin123');
}

main().catch(console.error);
