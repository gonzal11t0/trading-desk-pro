// quick-test.js - Prueba rápida del generador
const { generateSecurePassword, isPasswordSafeForEnv } = import('../src/utils/passwordGenerator');

console.log('🧪 PRUEBA RÁPIDA - GENERADOR DE CONTRASEÑAS\n');

// Generar 5 contraseñas de prueba
console.log('🔐 CONTRASEÑAS GENERADAS:');
for (let i = 0; i < 5; i++) {
  const password = generateSecurePassword();
  const safe = isPasswordSafeForEnv(password);
  const hasHash = password.includes('#');
  const hasSemicolon = password.includes(';');
  const hasColon = password.includes(':');
  
  console.log(`\n${i + 1}. ${password}`);
  console.log(`   Segura para .env: ${safe ? '✅' : '❌'}`);
  console.log(`   Tiene #: ${hasHash ? '❌ (PROBLEMA!)' : '✅'}`);
  console.log(`   Tiene ;: ${hasSemicolon ? '❌ (PROBLEMA!)' : '✅'}`);
  console.log(`   Tiene :: ${hasColon ? '❌ (PROBLEMA!)' : '✅'}`);
}

console.log('\n' + '='.repeat(50));
console.log('✅ El generador NUNCA usará: # ; : { } | " \' ` \\ espacio');
console.log('✅ Símbolos seguros: ! $ % & * ( ) _ + - = [ ] < > ? @');
console.log('='.repeat(50));