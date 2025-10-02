-- ============================================
-- KENYAN CURRICULUM LEARNING CONTENT
-- Comprehensive modules for CBC and 8-4-4 systems
-- ============================================

-- Insert Kenyan Curriculum Learning Modules

-- MATHEMATICS MODULES
INSERT INTO public.learning_modules (title, description, category, content, difficulty, duration, created_at) VALUES
('Grade 1 Mathematics - Numbers 1-100', 'Learn counting, number recognition, and basic addition and subtraction for Grade 1 learners', 'curriculum', '{"topics": ["Counting 1-100", "Number patterns", "Addition facts", "Subtraction basics", "Simple word problems"], "activities": ["Count objects", "Number matching", "Simple calculations", "Drawing shapes"], "resources": ["Number charts", "Counters", "Math games"]}', 'beginner', '4 weeks', NOW()),

('Grade 4 Mathematics - Fractions', 'Understanding fractions, equivalence, and basic operations with fractions', 'curriculum', '{"topics": ["Introduction to fractions", "Equivalent fractions", "Adding fractions", "Subtracting fractions", "Mixed numbers"], "activities": ["Fraction diagrams", "Pizza sharing", "Fraction games", "Real-world applications"], "resources": ["Fraction strips", "Visual aids", "Practice worksheets"]}', 'intermediate', '3 weeks', NOW()),

('Form 2 Mathematics - Algebra', 'Master algebraic expressions, equations, and problem-solving techniques', 'curriculum', '{"topics": ["Algebraic expressions", "Linear equations", "Simultaneous equations", "Quadratic expressions", "Word problems"], "activities": ["Equation solving", "Formula application", "Real-world modeling", "Group problem-solving"], "resources": ["Formula sheets", "Practice problems", "Online calculators"]}', 'advanced', '6 weeks', NOW());

-- SCIENCE MODULES
INSERT INTO public.learning_modules (title, description, category, content, difficulty, duration, created_at) VALUES
('Grade 3 Science - Plants and Animals', 'Explore the world of living things, their characteristics and habitats', 'curriculum', '{"topics": ["Parts of plants", "Animal classification", "Life cycles", "Habitats", "Food chains"], "activities": ["Plant observation", "Animal classification", "Garden project", "Nature walk", "Drawing diagrams"], "resources": ["Plant specimens", "Pictures", "Videos", "Science charts"]}', 'beginner', '4 weeks', NOW()),

('Grade 6 Science - The Human Body', 'Learn about body systems, health, and how our bodies function', 'curriculum', '{"topics": ["Skeletal system", "Digestive system", "Respiratory system", "Circulatory system", "Health and hygiene"], "activities": ["Body system diagrams", "Health discussions", "First aid basics", "Nutrition planning"], "resources": ["Anatomy charts", "Models", "Health videos"]}', 'intermediate', '5 weeks', NOW()),

('Form 3 Chemistry - Acids, Bases and Salts', 'Understanding chemical reactions, pH levels, and salt formation', 'curriculum', '{"topics": ["Properties of acids", "Properties of bases", "pH scale", "Neutralization", "Salt preparation"], "activities": ["pH testing", "Lab experiments", "Indicator tests", "Salt crystallization"], "resources": ["Lab equipment", "Safety materials", "Chemical samples"]}', 'advanced', '4 weeks', NOW());

-- LANGUAGES (ENGLISH & KISWAHILI)
INSERT INTO public.learning_modules (title, description, category, content, difficulty, duration, created_at) VALUES
('Grade 2 English - Reading Comprehension', 'Develop reading skills through stories, poems, and simple texts', 'curriculum', '{"topics": ["Letter sounds", "Simple words", "Short sentences", "Story reading", "Picture description"], "activities": ["Read aloud", "Story telling", "Word games", "Drawing stories", "Group reading"], "resources": ["Storybooks", "Flashcards", "Picture books", "Reading corner"]}', 'beginner', '8 weeks', NOW()),

('Grade 5 Kiswahili - Uandishi na Insha', 'Jifunze jinsi ya kuandika insha nzuri na matumizi sahihi ya lugha', 'curriculum', '{"topics": ["Aina za insha", "Mpangilio wa insha", "Matumizi ya maneno", "Sarufi", "Uandishi wa barua"], "activities": ["Kuandika insha", "Kusoma na kueleza", "Majadiliano", "Michezo ya lugha"], "resources": ["Vitabu vya Kiswahili", "Kamusi", "Maandishi ya mfano"]}', 'intermediate', '6 weeks', NOW()),

('Form 1 English Literature - Poetry Analysis', 'Explore poetic devices, themes, and how to analyze poems effectively', 'curriculum', '{"topics": ["Poetic devices", "Themes and messages", "Tone and mood", "Structure and form", "Contextual analysis"], "activities": ["Poem reading", "Group discussions", "Creative writing", "Performance poetry"], "resources": ["Poetry anthology", "Analysis guides", "Audio recordings"]}', 'intermediate', '5 weeks', NOW());

-- SOCIAL STUDIES & CRE
INSERT INTO public.learning_modules (title, description, category, content, difficulty, duration, created_at) VALUES
('Grade 4 Social Studies - Kenyan History', 'Learn about Kenya''s journey to independence and our national heroes', 'curriculum', '{"topics": ["Pre-colonial Kenya", "Colonial period", "Freedom fighters", "Independence", "Modern Kenya"], "activities": ["Timeline creation", "Hero profiles", "Map work", "Presentations", "Museum visits"], "resources": ["History books", "Maps", "Pictures", "Videos", "Guest speakers"]}', 'intermediate', '6 weeks', NOW()),

('Grade 6 CRE - Parables of Jesus', 'Understanding the teachings of Jesus through parables and their application', 'curriculum', '{"topics": ["Parable of the Sower", "Lost Sheep", "Good Samaritan", "Prodigal Son", "Talents"], "activities": ["Story telling", "Drama", "Discussions", "Moral lessons", "Application to life"], "resources": ["Bible", "Story books", "Pictures", "Videos"]}', 'beginner', '4 weeks', NOW());

-- FINANCIAL LITERACY
INSERT INTO public.learning_modules (title, description, category, content, difficulty, duration, created_at) VALUES
('Basic Money Management for Youth', 'Learn how to save, budget, and make smart financial decisions', 'financial_literacy', '{"topics": ["Understanding money", "Saving habits", "Budgeting basics", "Needs vs wants", "Banking basics"], "activities": ["Create a budget", "Savings goals", "Money games", "Bank visit", "Shopping simulation"], "resources": ["Budget templates", "Savings charts", "Money games", "Bank materials"]}', 'beginner', '3 weeks', NOW()),

('Small Business for Students', 'Learn entrepreneurship skills and how to start a small business', 'financial_literacy', '{"topics": ["Business ideas", "Market research", "Pricing", "Record keeping", "Customer service"], "activities": ["Business plan", "Mini projects", "Sales practice", "Team work"], "resources": ["Business templates", "Success stories", "Calculators"]}', 'intermediate', '4 weeks', NOW()),

('Mobile Money and Digital Banking', 'Understanding M-Pesa, digital payments, and online banking safety', 'financial_literacy', '{"topics": ["M-Pesa basics", "Digital payments", "Online safety", "Transaction records", "Fraud prevention"], "activities": ["Practice transactions", "Safety discussions", "Case studies"], "resources": ["Demo apps", "Safety guides", "Real examples"]}', 'intermediate', '2 weeks', NOW());

-- DIGITAL SKILLS
INSERT INTO public.learning_modules (title, description, category, content, difficulty, duration, created_at) VALUES
('Computer Basics for Beginners', 'Introduction to computers, typing, and basic applications', 'digital_skills', '{"topics": ["Computer parts", "Keyboard and mouse", "Typing skills", "Basic software", "Internet basics"], "activities": ["Typing practice", "Software exploration", "Safe browsing", "Email creation"], "resources": ["Computers", "Typing software", "Educational apps"]}', 'beginner', '4 weeks', NOW()),

('Microsoft Office for Students', 'Master Word, Excel, and PowerPoint for school projects', 'digital_skills', '{"topics": ["Word processing", "Spreadsheets", "Presentations", "Formatting", "Charts and graphs"], "activities": ["Document creation", "Data entry", "Presentation design", "Projects"], "resources": ["MS Office", "Templates", "Practice files"]}', 'intermediate', '6 weeks', NOW()),

('Coding for Kids - Scratch Programming', 'Learn programming concepts through fun Scratch projects', 'digital_skills', '{"topics": ["Scratch interface", "Sprites and costumes", "Motion and events", "Loops", "Simple games"], "activities": ["Create animations", "Build games", "Story projects", "Share creations"], "resources": ["Scratch software", "Project ideas", "Tutorial videos"]}', 'beginner', '8 weeks', NOW()),

('Internet Safety and Digital Citizenship', 'Learn how to stay safe online and be a responsible digital citizen', 'digital_skills', '{"topics": ["Online privacy", "Cyberbullying", "Password security", "Social media safety", "Digital footprint"], "activities": ["Safety discussions", "Case studies", "Password creation", "Safety pledge"], "resources": ["Safety guides", "Videos", "Interactive quizzes"]}', 'beginner', '2 weeks', NOW());

-- AGRICULTURE
INSERT INTO public.learning_modules (title, description, category, content, difficulty, duration, created_at) VALUES
('Kitchen Garden Basics', 'Learn how to start and maintain a kitchen garden at home', 'agriculture', '{"topics": ["Soil preparation", "Vegetable selection", "Planting techniques", "Watering", "Pest control", "Harvesting"], "activities": ["Garden planning", "Seed planting", "Daily care", "Harvest celebration"], "resources": ["Seeds", "Tools", "Compost", "Garden space"]}', 'beginner', '12 weeks', NOW()),

('Poultry Farming for Beginners', 'Introduction to keeping chickens and basic poultry management', 'agriculture', '{"topics": ["Chicken breeds", "Housing", "Feeding", "Health care", "Egg production", "Record keeping"], "activities": ["Coop design", "Feeding practice", "Health checks", "Business planning"], "resources": ["Chicken guides", "Feed samples", "Health materials"]}', 'intermediate', '8 weeks', NOW()),

('Organic Farming Techniques', 'Learn sustainable farming methods and organic pest control', 'agriculture', '{"topics": ["Composting", "Organic fertilizers", "Companion planting", "Natural pest control", "Water conservation"], "activities": ["Compost making", "Organic garden", "Pest identification", "Sustainability projects"], "resources": ["Compost bins", "Organic materials", "Planting guides"]}', 'intermediate', '6 weeks', NOW()),

('Fish Farming Basics', 'Introduction to aquaculture and small-scale fish farming', 'agriculture', '{"topics": ["Fish species", "Pond construction", "Water quality", "Feeding", "Disease management", "Marketing"], "activities": ["Pond visits", "Water testing", "Feed preparation", "Business planning"], "resources": ["Fish farming guides", "Water test kits", "Expert videos"]}', 'advanced', '10 weeks', NOW());

-- Add more specific grade-level content
INSERT INTO public.learning_modules (title, description, category, content, difficulty, duration, created_at) VALUES
('Grade 7 Geography - Weather and Climate', 'Understanding weather patterns, climate zones, and their effects in Kenya', 'curriculum', '{"topics": ["Weather elements", "Climate regions", "Rainfall patterns", "Temperature variations", "Climate change"], "activities": ["Weather observation", "Climate maps", "Data recording", "Research projects"], "resources": ["Weather instruments", "Maps", "Climate data", "Videos"]}', 'intermediate', '5 weeks', NOW()),

('Form 4 Biology - Genetics and Heredity', 'Master inheritance patterns, DNA, and genetic variation', 'curriculum', '{"topics": ["Mendelian genetics", "DNA structure", "Cell division", "Genetic disorders", "Biotechnology"], "activities": ["Punnett squares", "Model making", "Case studies", "Research"], "resources": ["Genetics charts", "Models", "Lab equipment", "Research papers"]}', 'advanced', '7 weeks', NOW());

COMMIT;
