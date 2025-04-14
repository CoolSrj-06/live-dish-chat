
import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/components/QuestionList';

// Service to fetch events, sessions, and analytics data from Supabase
export class SupabaseService {
  // Fetch all events
  public static async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*');
    
    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
    
    return data || [];
  }

  // Fetch a specific event by ID
  public static async getEvent(eventId: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    if (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
    
    return data;
  }

  // Fetch all sessions for an event
  public static async getSessionsForEvent(eventId: string) {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('event_id', eventId)
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
    
    return data || [];
  }

  // Fetch questions for a session
  public static async getQuestionsForSession(sessionId: string) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
    
    return data.map(q => ({
      id: q.id,
      text: q.text,
      timestamp: new Date(q.timestamp).getTime(),
      username: q.username
    })) as Question[];
  }

  // Submit a question for a session
  public static async submitQuestion(sessionId: string, questionText: string, username: string = 'Anonymous') {
    const { data, error } = await supabase
      .from('questions')
      .insert([
        {
          session_id: sessionId,
          text: questionText,
          username
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error submitting question:', error);
      throw error;
    }
    
    return {
      id: data.id,
      text: data.text,
      timestamp: new Date(data.timestamp).getTime(),
      username: data.username
    } as Question;
  }

  // Fetch analytics for a session
  public static async getAnalyticsForSession(sessionId: string) {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('session_id', sessionId)
      .single();
    
    if (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
    
    return data;
  }
}

export default SupabaseService;
