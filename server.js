import cors from 'cors';  // ✅ Import cors
import express from 'express';
import pg from 'pg';

const { Client } = pg;  // ✅ Extract Client from the default import

const app = express();
app.use(cors());  // Enable CORS for frontend communication
app.use(express.json());  // Middleware to parse JSON

// PostgreSQL Connection
const dbClient = new Client({
  host: 'dpg-cv2klr9u0jms7394gqd0-a.frankfurt-postgres.render.com',
  database: 'fttc',
  user: 'fttc_user',
  password: 'QLD0vqa4J3EcSHDDFf2IgAjRbU7RMIMo',
  port: 5432,
  ssl: { rejectUnauthorized: false }  // Required for Render databases
});

// ✅ Ensure the database connection is established
dbClient.connect()
  .then(() => console.log("✅ Connected to PostgreSQL Database"))
  .catch(err => console.error("❌ Database Connection Error:", err));

app.get('/fetchData', async (req, res) => {
  const { type, status } = req.query;
  try {
    let query = '';
    
    if (type === 'Poles') {
      query = 'SELECT pk, name, type, pole_use, ST_AsText(geom) as geom FROM sales.poles';
    } else if (type === 'Connections') {
      if (status) {
        // If a status is provided, filter connections by the status
        query = `SELECT pk, pole_name, frogfoot_free, active, dormant, ina, ST_AsText(geom) as geom 
                 FROM sales.connections022025 
                 WHERE ${status} = true`;  // Adjust based on your column names
      } else {
        // Fetch all connections if no specific status is passed
        query = 'SELECT pk, pole_name, frogfoot_free, active, dormant, ina, ST_AsText(geom) as geom FROM sales.connections022025';
      }
    } else {
      return res.status(400).json({ error: "Invalid type parameter. Use 'Poles' or 'Connections'." });
    }
    
    const result = await dbClient.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data from the database." });
  }
});

// ✅ Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
