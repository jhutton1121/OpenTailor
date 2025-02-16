import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Initialize OpenAI (the API key should be passed via environment variable)
const openai = new OpenAI();

// Ensure the output directory exists
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Configure file uploads with multer
const upload = multer({ dest: "uploads/" });
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET route to serve the form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// POST route to process the form submission
app.post("/submit", upload.single("career_context"), (req, res) => {
  const { current_resume, job_description, additional_instruction } = req.body;

  if (!current_resume || !job_description || !req.file) {
    return res
      .status(400)
      .send("Missing required fields: current resume, job description, or career context file.");
  }

  // Save the resume, job description, and additional instructions
  fs.writeFileSync(path.join(outputDir, "current_resume.txt"), current_resume, "utf8");
  fs.writeFileSync(path.join(outputDir, "job_description.txt"), job_description, "utf8");
  if (additional_instruction && additional_instruction.trim() !== "") {
    fs.writeFileSync(path.join(outputDir, "additional_instruction.txt"), additional_instruction, "utf8");
  }

  // Move the uploaded file to the output directory
  const targetCareerContextPath = path.join(outputDir, "career_context.txt");
  fs.rename(req.file.path, targetCareerContextPath, async (err) => {
    if (err) {
      console.error("Error moving career_context.txt:", err);
      return res.status(500).send("Error processing career context file.");
    }

    // Read template files
    let systemPrompt, latexTemplate;
    try {
      systemPrompt = fs.readFileSync(path.join(__dirname, "system_prompt.txt"), "utf8");
      latexTemplate = fs.readFileSync(path.join(__dirname, "latex_template.txt"), "utf8");
    } catch (err) {
      console.error("Error reading system_prompt.txt or latex_template.txt:", err);
      return res.status(500).send("Error reading prompt or template.");
    }

    // Read the career context content
    let careerContext;
    try {
      careerContext = fs.readFileSync(targetCareerContextPath, "utf8");
    } catch (err) {
      console.error("Error reading career_context.txt:", err);
      return res.status(500).send("Error reading career context file.");
    }

    // Build the tailor prompt
    let tailorPrompt = systemPrompt + "\n\n";
    tailorPrompt += "```" + "\n" + current_resume + "\n" + "```" + "\n\n";
    tailorPrompt += "<" + "\n" + careerContext + "\n" + ">" + "\n\n";
    tailorPrompt += "####" + "\n" + job_description + "\n" + "####" + "\n\n";
    tailorPrompt += "****" + "\n" + latexTemplate + "\n" + "****" + "\n\n";
    if (additional_instruction && additional_instruction.trim() !== "") {
      tailorPrompt += "---" + "\n" + additional_instruction + "\n" + "---" + "\n\n";
    }

    // Save the combined tailor prompt for reference
    const tailorPromptPath = path.join(outputDir, "tailor_prompt.txt");
    try {
      fs.writeFileSync(tailorPromptPath, tailorPrompt, "utf8");
    } catch (writeErr) {
      console.error("Error writing tailor_prompt.txt:", writeErr);
      return res.status(500).send("Error saving tailor prompt.");
    }

    try {
      // Create the chat completion using the new SDK style
      const apiResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: tailorPrompt }],
        store: true,
      });

      const latexCode = apiResponse.choices[0].message.content;
      const latexFilePath = path.join(outputDir, "latex_code.txt");
      fs.writeFileSync(latexFilePath, latexCode, "utf8");

      // Instead of generating a PDF, simply return the LaTeX code text file
      res.sendFile(latexFilePath);
    } catch (apiError) {
      console.error(
        "Error calling ChatGPT API:",
        apiError.response ? apiError.response.data : apiError
      );
      return res.status(500).send("Error calling ChatGPT API.");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
