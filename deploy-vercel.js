import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Iniciando despliegue en Vercel...\n');

try {
  // 1. Verificar que estamos en el directorio correcto
  console.log('1️⃣ Verificando directorio...');
  if (!fs.existsSync('package.json')) {
    throw new Error('No se encontró package.json. Ejecuta desde el directorio api-monteluz');
  }
  console.log('✅ Directorio correcto');

  // 2. Verificar que Vercel CLI esté instalado
  console.log('\n2️⃣ Verificando Vercel CLI...');
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI instalado');
  } catch (error) {
    console.log('❌ Vercel CLI no está instalado');
    console.log('💡 Instalando Vercel CLI...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI instalado');
  }

  // 3. Verificar configuración de Vercel
  console.log('\n3️⃣ Verificando configuración de Vercel...');
  if (!fs.existsSync('vercel.json')) {
    throw new Error('No se encontró vercel.json');
  }
  console.log('✅ Configuración de Vercel encontrada');

  // 4. Verificar variables de entorno
  console.log('\n4️⃣ Verificando variables de entorno...');
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_KEY',
    'JWT_SECRET'
  ];

  const missingVars = [];
  for (const envVar of requiredEnvVars) {
    try {
      execSync(`vercel env ls | grep ${envVar}`, { stdio: 'pipe' });
      console.log(`✅ ${envVar} configurada`);
    } catch (error) {
      missingVars.push(envVar);
      console.log(`❌ ${envVar} no configurada`);
    }
  }

  if (missingVars.length > 0) {
    console.log('\n⚠️  Variables de entorno faltantes:');
    missingVars.forEach(envVar => {
      console.log(`   - ${envVar}`);
    });
    console.log('\n💡 Configura las variables con:');
    missingVars.forEach(envVar => {
      console.log(`   vercel env add ${envVar}`);
    });
    console.log('\n🔄 Continuando con el despliegue...');
  }

  // 5. Desplegar
  console.log('\n5️⃣ Desplegando en Vercel...');
  const deployOutput = execSync('vercel --prod --yes', { 
    stdio: 'pipe',
    encoding: 'utf8'
  });
  
  console.log('✅ Despliegue completado');
  console.log('\n📋 Información del despliegue:');
  console.log(deployOutput);

  // 6. Probar el despliegue
  console.log('\n6️⃣ Probando el despliegue...');
  try {
    const testResponse = await fetch('https://api-monteluz.vercel.app/health');
    const testData = await testResponse.json();
    console.log('✅ Despliegue funcionando:', testData.message);
  } catch (error) {
    console.log('⚠️  No se pudo probar el despliegue:', error.message);
  }

  console.log('\n🎉 ¡Despliegue completado exitosamente!');
  console.log('🌐 URL: https://api-monteluz.vercel.app');
  console.log('📚 Documentación: Ver README.md');

} catch (error) {
  console.error('\n❌ Error durante el despliegue:', error.message);
  console.log('\n💡 Soluciones:');
  console.log('1. Verifica que estés en el directorio api-monteluz');
  console.log('2. Instala Vercel CLI: npm install -g vercel');
  console.log('3. Configura las variables de entorno');
  console.log('4. Verifica tu conexión a internet');
  process.exit(1);
}
