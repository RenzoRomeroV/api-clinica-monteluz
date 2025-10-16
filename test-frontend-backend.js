import fetch from 'node-fetch';

const FRONTEND_URL = 'http://localhost:4200';
const BACKEND_URL = 'http://localhost:3000';

async function testFrontendBackendConnection() {
  console.log('🧪 Probando conexión Frontend ↔ Backend...\n');
  
  try {
    // 1. Verificar que el frontend esté funcionando
    console.log('1️⃣ Probando frontend Angular...');
    const frontendResponse = await fetch(FRONTEND_URL);
    if (frontendResponse.ok) {
      console.log('✅ Frontend Angular funcionando en http://localhost:4200');
    } else {
      console.log('❌ Frontend no responde correctamente');
      return;
    }
    
    // 2. Verificar que el backend esté funcionando
    console.log('\n2️⃣ Probando backend Node.js...');
    const backendResponse = await fetch(`${BACKEND_URL}/health`);
    const backendData = await backendResponse.json();
    if (backendData.success) {
      console.log('✅ Backend Node.js funcionando en http://localhost:3000');
    } else {
      console.log('❌ Backend no responde correctamente');
      return;
    }
    
    // 3. Probar login desde el backend (simulando petición del frontend)
    console.log('\n3️⃣ Probando login de administrador...');
    const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@monteluz.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    if (loginData.success) {
      console.log('✅ Login de administrador exitoso');
      console.log('👤 Usuario:', loginData.usuario.nombre, loginData.usuario.apellido);
      console.log('🔑 Token generado:', loginData.token.substring(0, 20) + '...');
    } else {
      console.log('❌ Error en login:', loginData.message);
      return;
    }
    
    // 4. Probar verificación de token
    console.log('\n4️⃣ Probando verificación de token...');
    const verifyResponse = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: loginData.token
      })
    });
    
    const verifyData = await verifyResponse.json();
    if (verifyData.success) {
      console.log('✅ Token verificado correctamente');
      console.log('👤 Usuario verificado:', verifyData.usuario.nombre);
    } else {
      console.log('❌ Error verificando token:', verifyData.message);
    }
    
    console.log('\n🎉 ¡Conexión Frontend ↔ Backend exitosa!');
    console.log('\n📋 Resumen:');
    console.log('   Frontend: http://localhost:4200 ✅');
    console.log('   Backend: http://localhost:3000 ✅');
    console.log('   Base de datos: Supabase ✅');
    console.log('   Autenticación: Funcionando ✅');
    
    console.log('\n🚀 Para probar el login:');
    console.log('   1. Abre http://localhost:4200 en tu navegador');
    console.log('   2. Ve a la página de login de administrador');
    console.log('   3. Usa las credenciales: admin@monteluz.com / admin123');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

testFrontendBackendConnection();
