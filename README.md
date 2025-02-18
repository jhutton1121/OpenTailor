# OpenTailor
OpenTailor is a lightweight, node.js application created to help tailor your resume to job descriptions. I created this application
to help my team from Rent.com in their job searches after Redfin layoffs.

The user should create a career_context.txt file on their computer. This file should contain your written work history, education history, and any additional project
work that you have done which could be relevant. You only need to write this file once- It should contain a LOT of context.

The UI lets you copy and paste in your current resume, upload the .txt career context, and then copy and paste the job description. 
You can provide additional instructions like "keep the bullet points for experience X untouched"

Once you submit your information for tailoring, it will redirect you to OpenLeaf.com for rendering your PDF.

# How to use it
* Clone the git repository locally on your computer.
* Create .env file and update to have OPENAI_API_KEY=yourkeyhere
* Ensure you have Docker downloaded on your computer. If you do not, navigate to https://www.docker.com/products/docker-desktop/ and download Docker Desktop.
* Once Docker is installed, navigate to the project in your terminal and enter  `docker compose up`
* Once the application has built and the server has run, navigate to localhost:3000
* Copy and paste your current resume from Doc or PDF into the appropriate input form
* Upload your career_context.txt essay
* Copy and paste the job description into the appropriate input form
* Submit

It will send your resume and context to the openAI API, have chatGPT edit the bullet points and skills to better match the job description, and then redirect you to Overleaf.com
You can make any final edits to the bullet points here before downloading the PDF. Navigate back to localhost:3000 to start another resume.

