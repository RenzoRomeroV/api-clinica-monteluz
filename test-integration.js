import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api/auth';

async function testIntegration() {
  console.log('🧪 Probando integración del backend...\n');
  
  try {
    // 1. Probar conexión básica
    console.log('1️⃣ Probando conexión básica...');
    const healthResponse = await fetch('http://localhost:3000/health');
    const healthData = await healthResponse.json();
    console.log('✅ Conexión:', healthData.message);
    
    // 2. Probar login de administrador
    console.log('\n2️⃣ Probando login de administrador...');
    const loginResponse = await fetch(`${API_URL}/login`, {
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
      console.log('✅ Login exitoso:', loginData.message);
      console.log('👤 Usuario:', loginData.usuario.nombre, loginData.usuario.apellido);
      console.log('🔑 Token:', loginData.token.substring(0, 20) + '...');
      
      // 3. Probar verificación de token
      console.log('\n3️⃣ Probando verificación de token...');
      const verifyResponse = await fetch(`${API_URL}/verify`, {
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
        console.log('✅ Token válido:', verifyData.message);
        console.log('👤 Usuario verificado:', verifyData.usuario.nombre);
      } else {
        console.log('❌ Error verificando token:', verifyData.message);
      }
      
    } else {
      console.log('❌ Error en login:', loginData.message);
    }
    
    // 4. Probar login de doctor
    console.log('\n4️⃣ Probando login de doctor...');
    const doctorLoginResponse = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'doctor@monteluz.com',
        password: 'admin123'
      })
    });
    
    const doctorLoginData = await doctorLoginResponse.json();
    
    if (doctorLoginData.success) {
      console.log('✅ Login de doctor exitoso:', doctorLoginData.message);
      console.log('👤 Doctor:', doctorLoginData.usuario.nombre, doctorLoginData.usuario.apellido);
    } else {
      console.log('❌ Error en login de doctor:', doctorLoginData.message);
    }
    
    // 5. Probar login de paciente
    console.log('\n5️⃣ Probando login de paciente...');
    const patientLoginResponse = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'paciente@monteluz.com',
        password: 'admin123'
      })
    });
    
    const patientLoginData = await patientLoginResponse.json();
    
    if (patientLoginData.success) {
      console.log('✅ Login de paciente exitoso:', patientLoginData.message);
      console.log('👤 Paciente:', patientLoginData.usuario.nombre, patientLoginData.usuario.apellido);
    } else {
      console.log('❌ Error en login de paciente:', patientLoginData.message);
    }
    
    console.log('\n🎉 Pruebas de integración completadas');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

testIntegration();
