# Requirement Analysis

__Task 2: Analyse functional and non\-functional requirements, identifying ambiguities and omissions\.__

This document outlines the core requirements extracted from the Brackets study management platform, followed by an analysis of areas lacking detail or containing discrepancies\.

## 1\. Functional Requirements

These define what the system must do—the specific behaviors and features it provides to the user\.

- __User Registration and Authentication:__ The system must allow users to sign up securely, sign in, and manage their profile details using Supabase authentication\.
- __Study Period Management:__ Users must be able to create, edit, delete, and manage "Brackets" \(e\.g\., semesters, terms\)\. Users must be able to mark a specific Bracket as the "Current" one\.
- __Unit/Topic Organization:__ Within each Bracket, users must be able to create, edit, and delete "Units" \(topics or subjects\) to categorize their studies\.
- __Study Material Handling:__ Users must be able to upload educational content—including PDFs, Word documents, PowerPoint presentations, and Images—directly into specific Units\. 
- __Event and Calendar System:__ Users must be able to schedule, view, and delete upcoming academic events, classifying them strictly as "Event", "Exam", or "Assignment"\.
- __AI\-Powered Assistance:__ The system must provide a contextual chat interface powered by Google Gemini where users can ask questions\. The AI must be able to read extracted text from user\-uploaded PDFs and analyze uploaded image materials\.

## 2\. Non\-Functional Requirements

These define how the system behaves, specifying quality attributes, performance, and constraints\.

- __Responsiveness & UI/UX \(Usability\):__ The application must be fully responsive across mobile, tablet, and desktop devices utilizing Tailwind CSS, and must implement smooth Framer Motion animations to provide a premium user experience\.
- __Performance:__ The system must feel instantaneous\. Data fetching must utilize loading states gracefully, and static assets should be optimized\.
- __Security \(Data Isolation\):__ Row\-Level Security \(RLS\) must be rigidly enforced in the PostgreSQL database so that a user's study materials, brackets, and events can never be accessed by another unauthorized user\.
- __Availability \(Offline Support\):__ The application must function as a Progressive Web App \(PWA\) using service workers to provide limited offline functionality and seamless installation onto devices\.

## 3\. Analysis: Ambiguities and Omissions

During the requirement extraction and code review phases, the following specific ambiguities and omissions were identified:

### Omissions \(Missing Details or Implementation\)

1. __Missing Event Date Display on Dashboard:__ The requirements imply that users should be able to see upcoming events on the Home page\. However, the exact date is physically omitted from the UI due to commented\-out code in Home\.jsx\. It is a critical omission that users see an event title but not when it occurs\.
2. __No Account Recovery Workflow:__ While Sign In and Sign Up are fully implemented in the functional code, there is no explicit requirement or UI flow for "Forgot Password" or account recovery, leaving users stranded if they lose their credentials\.
3. __Missing Client\-Side File Validation:__ The UI explicitly states "File \(PDF, Word, PowerPoint, or Image \- max 10MB\)" when uploading content in Content\.jsx\. However, checking the upload function reveals no actual client\-side logic bounding the file size to 10MB before sending it to the server, representing an implementation omission\.

### Ambiguities \(Unclear or Conflicting Rules\)

1. __Event vs\. Assignment Differentiation:__ The system allows creating an "Event", "Exam", or "Assignment"\. The requirement for what visually separates an Assignment from an Exam is ambiguous\. On the Home page dashboard, Assignments map to one icon and Exams to another, but generic "Events" lack clear visual priority or differing behavioral logic\.
2. __Visual PDF Analysis Limits:__ The AI service specifies that it converts "up to 20 pages" of a PDF to images for visual analysis, but converts "up to 10 pages" for OCR text extraction \(aiService\.js\)\. It is highly ambiguous to the end user what portion of their large uploaded textbook or reading assignment the AI is actually able to read, potentially leading to incorrect AI summaries without explicit warnings to the user\.

