// 课堂点子铺（kongsi-idea）专属的 Supabase project，不与 EduNeo 或其他专案共用。
// anon key 设计上就是给前端公开用的，配合 supabase/schema.sql 里的 RLS 规则限制权限；
// service_role key 和数据库密码绝对不能出现在这份公开仓库里，只留在开发者本机。
const SUPABASE_URL = "https://gntnkhkkgonaehapcerr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdudG5raGtrZ29uYWVoYXBjZXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MDc2NTgsImV4cCI6MjEwMDM4MzY1OH0.9_08R--1vQxN6CIRmrbvkVN2O-bSDJgGq6XKgOp5mis";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
