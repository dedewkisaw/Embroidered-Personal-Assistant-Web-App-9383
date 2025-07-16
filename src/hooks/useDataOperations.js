import { useState, useCallback } from 'react';
import { tasksApi, notesApi, eventsApi } from '../lib/supabase';

export const useTaskOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTask = useCallback(async (task) => {
    try {
      setLoading(true);
      setError(null);
      return await tasksApi.create(task);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      return await tasksApi.update(id, updates);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await tasksApi.delete(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      return await tasksApi.getAll();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks
  };
};

export const useNoteOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createNote = useCallback(async (note) => {
    try {
      setLoading(true);
      setError(null);
      return await notesApi.create(note);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNote = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      return await notesApi.update(id, updates);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteNote = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await notesApi.delete(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      return await notesApi.getAll();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    fetchNotes
  };
};

export const useEventOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createEvent = useCallback(async (event) => {
    try {
      setLoading(true);
      setError(null);
      return await eventsApi.create(event);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvent = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      return await eventsApi.update(id, updates);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEvent = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await eventsApi.delete(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      return await eventsApi.getAll();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    fetchEvents
  };
};