
import { Pool } from 'pg';

// We'll use these placeholder values that you'll replace with your RDS credentials
const pool = new Pool({
  host: 'your-rds-endpoint',
  database: 'your-database-name',
  user: 'your-username',
  password: 'your-password',
  port: 5432,
  ssl: {
    rejectUnauthorized: false // You might want to set this to true in production
  }
});

export const rdsClient = {
  query: (text: string, params?: any[]) => pool.query(text, params)
};
