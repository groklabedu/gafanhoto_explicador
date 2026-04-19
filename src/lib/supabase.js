import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://znotdcvkdsvykyvishjg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpub3RkY3ZrZHN2eWt5dmlzaGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1Njk4NjMsImV4cCI6MjA5MjE0NTg2M30.-rSeW-JiHNYzkGVGf5FYMl4g-VztpxgES_aXh-9vjUc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
