# SDLC and Testing Mapping \(V\-Model\)

__Task 3: Using V\-model map SDLC phases to testing levels for the Brackets project\.__

The V\-Model is a Software Development Life Cycle \(SDLC\) model where the execution of processes happens in a sequential, V\-shape\. Each phase in the development cycle has a corresponding testing phase\.

Here is the mapping of the SDLC phases to their corresponding testing levels, applied specifically to the Brackets project:

## 1\. Requirement Analysis $\\leftrightarrow$ Acceptance Testing

- __SDLC Phase:__ Gathering business requirements \(e\.g\., users need to organize study units, upload PDFs, and chat with an AI assistant\)\. Checking for ambiguities and omissions\.
- __Testing Level:User Acceptance Testing \(UAT\)\.__
- __Brackets Context:__ Validating that a student can successfully sign up, create a study Bracket, upload a study guide PDF, and ask the AI a question about that specific document\. This verifies the system meets the user's ultimate needs\.

## 2\. System Design $\\leftrightarrow$ System Testing

- __SDLC Phase:__ Defining the overall system architecture, including hardware and software requirements\. For Brackets, this means deciding on a React frontend, Supabase backend \(Auth, Database, Storage\), and Groq/Google Gemini AI integration\.
- __Testing Level:System Testing\.__
- __Brackets Context:__ Testing the complete, integrated application as a whole\. This involves verifying that the React application correctly communicates with the Supabase PostgreSQL database to fetch events and securely stores PDF files in Supabase Storage, while also properly routing prompts to the external Groq AI API\.

## 3\. Architecture Design $\\leftrightarrow$ Integration Testing

- __SDLC Phase:__ Breaking the system down into modules and defining how they communicate\. In Brackets, this is the high\-level React component structure \(Routing, Context API\) and external service wrappers\.
- __Testing Level:Integration Testing\.__
- __Brackets Context:__ Testing the interfaces between internal modules\. For example, ensuring that the UserContext correctly provides the state of brackets and units to the Ai\_Assistant\.jsx component, and that aiService\.js correctly passes the active user session data to generate context\-aware AI responses\.

## 4\. Module Design $\\leftrightarrow$ Unit Testing

- __SDLC Phase:__ The detailed internal design of each individual component or function\. For example, how a specific React component \(like Events\.jsx\) filters data or handles a button click\.
- __Testing Level:Unit Testing\.__
- __Brackets Context:__ Testing individual, isolated pieces of code\. For instance, testing if the formatDate\(\) helper function in Events\.jsx correctly formats a given date string, or verifying that the Events component accurately filters the events array when the "upcoming" or "past" filter buttons are clicked, independent of the database\.

## 5\. Coding $\\leftrightarrow$ Static Analysis / Code Review

- __SDLC Phase:__ Writing the actual program code \(e\.g\., implementing the JSX, Tailwind CSS, and JavaScript logic\)\.
- __Testing Level:Static Analysis and Code Review\.__
- __Brackets Context:__ Running tools like ESLint to catch syntax errors or unused variables during development, and performing peer reviews to spot faults such as duplicated conditional checks or leftover console\.log statements before they cause failures in higher\-level tests\.

