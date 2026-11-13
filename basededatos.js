import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://TU-PROYECTO.supabase.co',
  'TU_ANON_KEY'
)

// Registro (el perfil se crea solo gracias al trigger)
await supabase.auth.signUp({
  email: 'mateo@mail.com',
  password: '123456',
  options: { data: { nombre: 'Mateo', apellido: 'Pérez', rol: 'estudiante' } }
})

// Login
await supabase.auth.signInWithPassword({ email: 'mateo@mail.com', password: '123456' })

// Listar cursos publicados
const { data: cursos } = await supabase.from('cursos').select('*').eq('publicado', true)

// Inscribirse a un curso
const { data: { user } } = await supabase.auth.getUser()
await supabase.from('inscripciones').insert({ estudiante_id: user.id, curso_id: 1 })