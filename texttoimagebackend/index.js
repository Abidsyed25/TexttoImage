const express = require("express");
const cors = require("cors");
const { pipeline } = require("stream");
const { promisify } = require("util");
require("dotenv").config(); // Load environment variables

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const streamPipeline = promisify(pipeline);

async function query(prompt) {
  const response = await fetch(process.env.API_URL, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ inputs: prompt }),
  });

  if (!response.ok) {
    throw new Error(`API returned status: ${response.status}`);
  }

  return response.body; // Return the readable stream
}

// Endpoint to handle image generation requests
app.post("/", async (req, res) => {
  const prompt = req.body.prompt;
  console.log(prompt);

  try {
    const imageStream = await query(prompt);

    res.writeHead(200, {
      "Content-Type": "image/jpeg",
    });

    // Pipe the image stream directly to the response
    await streamPipeline(imageStream, res);
  } catch (error) {
    console.error("Error querying the Text to Image API:", error);
    res.status(500).send("Error generating image");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
