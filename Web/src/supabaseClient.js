// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cszqqcmigoooousvelxn.supabase.co';
//const supabaseAnonKey = import.meta.env.SUPABASE_KEY;
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzenFxY21pZ29vb291c3ZlbHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYwMTMxOTMsImV4cCI6MjA0MTU4OTE5M30.UqezDulPWcDclwTTC9Z52a6nqy25awNRZGdfgfBPm3w"

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
