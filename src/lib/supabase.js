import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dbhdwiwomgzhtrodccsi.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiaGR3aXdvbWd6aHRyb2RjY3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTU1ODcsImV4cCI6MjA2NzEzMTU4N30.Ahyx9_9imyrut5h1Hn-dJ0HTiz-w4w1bHWPOV0PY8u0'

if (SUPABASE_URL == 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY == '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true }
})

// Tasks API
export const tasksApi = {
  async create(task) {
    const { data, error } = await supabase
      .from('tasks_n7x9k2')
      .insert(task)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('tasks_n7x9k2')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('tasks_n7x9k2')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('tasks_n7x9k2')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};

// Notes API
export const notesApi = {
  async create(note) {
    const { data, error } = await supabase
      .from('notes_n7x9k2')
      .insert(note)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('notes_n7x9k2')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('notes_n7x9k2')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('notes_n7x9k2')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};

// Events API
export const eventsApi = {
  async create(event) {
    const { data, error } = await supabase
      .from('calendar_events_n7x9k2')
      .insert(event)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('calendar_events_n7x9k2')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('calendar_events_n7x9k2')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('calendar_events_n7x9k2')
      .select('*')
      .order('start_time', { ascending: true });
    if (error) throw error;
    return data;
  }
};

export default supabase;