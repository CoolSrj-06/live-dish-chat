
import { rdsClient } from '@/integrations/rds/client';

export class RDSService {
  // Fetch all events
  public static async getEvents() {
    const result = await rdsClient.query(
      'SELECT * FROM events ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Fetch a specific event by ID
  public static async getEvent(eventId: string) {
    const result = await rdsClient.query(
      'SELECT * FROM events WHERE id = $1',
      [eventId]
    );
    return result.rows[0];
  }

  // Fetch all sessions for an event
  public static async getSessionsForEvent(eventId: string) {
    const result = await rdsClient.query(
      'SELECT * FROM sessions WHERE event_id = $1 ORDER BY start_time ASC',
      [eventId]
    );
    return result.rows;
  }

  // Fetch questions for a session
  public static async getQuestionsForSession(sessionId: string) {
    const result = await rdsClient.query(
      'SELECT * FROM questions WHERE session_id = $1 ORDER BY timestamp DESC',
      [sessionId]
    );
    return result.rows.map(q => ({
      id: q.id,
      text: q.text,
      timestamp: new Date(q.timestamp).getTime(),
      username: q.username
    }));
  }

  // Submit a question for a session
  public static async submitQuestion(sessionId: string, questionText: string, username: string = 'Anonymous') {
    const result = await rdsClient.query(
      'INSERT INTO questions (session_id, text, username) VALUES ($1, $2, $3) RETURNING *',
      [sessionId, questionText, username]
    );
    const q = result.rows[0];
    return {
      id: q.id,
      text: q.text,
      timestamp: new Date(q.timestamp).getTime(),
      username: q.username
    };
  }

  // Fetch analytics for a session
  public static async getAnalyticsForSession(sessionId: string) {
    const result = await rdsClient.query(
      'SELECT * FROM analytics WHERE session_id = $1',
      [sessionId]
    );
    return result.rows[0];
  }
}

export default RDSService;
