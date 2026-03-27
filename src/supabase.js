import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://csjhxmvxrbnygrzxgdkt.supabase.co'
const supabaseKey = 'sb_publishable_3zNfuHyNPtrWv6n5HPGbCg_zFbIAy7_'

export const supabase = createClient(supabaseUrl, supabaseKey)
