require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// --- THIS IS THE NEW AND IMPORTANT PART ---
// This line tells Express to serve any files in the 'uploads' directory
// as static files. This is what allows the browser to see the images.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- API Routes ---
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/passes', require('./routes/pass.routes'));
app.use('/api/scanner', require('./routes/scanner.routes'));
app.use('/api/clerk', require('./routes/approval.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));