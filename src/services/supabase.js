import { createClient } from '@supabase/supabase-js';

// reconnect after 1 week of inactivity
export const supabaseUrl = 'https://sounudvswkuurgeppmqo.supabase.co';

const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvdW51ZHZzd2t1dXJnZXBwbXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkxMzIyMTIsImV4cCI6MjAyNDcwODIxMn0.pwWWloytwjy0W_FB0KEUGinQ2ydfbC5n30eE8PeTErU';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
