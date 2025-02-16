# OpenTailor
OpenTailor is a lightweight, node.js application created to help tailor your resume to job descriptions. It is NOT intended to be used to spam job applications!!

The user should create a career_context.txt file on their computer. This file should contain your written work history, education history, and any additional project
work that you have done which could be relevant. You only need to write this file once- It should contain a LOT of context.

The UI lets you copy and paste in your current resume, upload the .txt career context, and then copy and paste the job description. 
You can provide additional instructions like "keep the bullet points for experience X untouched"

As of the first commit, the useful latex code returned is in latex_code.txt, but it also has some additional information returned by GPT.
In future versions, this context will be displayed and the LaTeX code that makes the tailored resume will be pulled out by itself
via RegEx and saved in a separate file. 

I use overleaf.com to render my LaTeX.
