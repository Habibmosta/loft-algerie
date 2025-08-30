const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function ensureDefaultCurrency() {
  try {
    console.log('🔍 Checking for default currency...');
    
    // Check if default currency exists
    const { data: existingCurrency, error: checkError } = await supabase
      .from('currencies')
      .select('*')
      .eq('is_default', true)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking currencies:', checkError);
      return;
    }

    if (existingCurrency) {
      console.log('✅ Default currency found:', existingCurrency.name, existingCurrency.symbol);
      return;
    }

    console.log('⚠️  No default currency found. Adding Algerian Dinar...');
    
    // Insert default currency
    const { error: insertError } = await supabase
      .from('currencies')
      .insert([
        {
          code: 'DZD',
          name: 'Dinar Algérien',
          symbol: 'DA',
          is_default: true,
          ratio: 1.0
        }
      ]);

    if (insertError) {
      console.error('❌ Error inserting currency:', insertError);
      return;
    }

    console.log('✅ Default currency (DZD) added successfully');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

ensureDefaultCurrency();