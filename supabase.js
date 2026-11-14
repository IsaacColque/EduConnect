// 1. Configuración de credenciales de Supabase
const SUPABASE_URL = 'https://zlgbnzafupigoezbcsu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_9Slr_t--WLGY6voRBemjjw_nMIRdISo';

// 2. Inicialización del cliente global de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 3. Exportar o dejar disponible (en JavaScript clásico con CDN, 'supabase' ya queda global)
console.log('Cliente de Supabase inicializado correctamente para EduConnect.');

async function probarConexion() {
  const { data, error } = await supabase
    .from('roles')
    .select('*');

  if (error) {
    console.error('Error al conectar:', error);
  } else {
    console.log('Roles obtenidos de Supabase:', data);
  }
}

