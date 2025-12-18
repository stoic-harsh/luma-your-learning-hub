import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const results: string[] = []

    // Create admin user
    const { data: adminUser, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@gmail.com',
      password: 'admin@123',
      email_confirm: true
    })

    if (adminError) {
      results.push(`Admin user: ${adminError.message}`)
    } else {
      results.push(`Admin user created: ${adminUser.user.id}`)
      
      // Assign admin role
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: adminUser.user.id, role: 'admin' })
      
      if (roleError) {
        results.push(`Admin role: ${roleError.message}`)
      } else {
        results.push('Admin role assigned')
      }
    }

    // Create harshit user
    const { data: harshitUser, error: harshitError } = await supabaseAdmin.auth.admin.createUser({
      email: 'harshit@gmail.com',
      password: 'harshit@123',
      email_confirm: true
    })

    if (harshitError) {
      results.push(`Harshit user: ${harshitError.message}`)
    } else {
      results.push(`Harshit user created: ${harshitUser.user.id}`)
      
      // Create profile for harshit
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: harshitUser.user.id,
          employee_id: 'EMP001',
          name: 'Harshit',
          email: 'harshit@gmail.com',
          employee_role: 'Programmer Analyst',
          office_location: 'Cyber Greens, Gurgaon'
        })
      
      if (profileError) {
        results.push(`Harshit profile: ${profileError.message}`)
      } else {
        results.push('Harshit profile created')
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
