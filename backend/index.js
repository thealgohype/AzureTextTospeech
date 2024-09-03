const express = require('express');
const cors = require('cors');
const { conversationrouter } = require('./routes/conversstion');
require('dotenv').config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/conversation", conversationrouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});