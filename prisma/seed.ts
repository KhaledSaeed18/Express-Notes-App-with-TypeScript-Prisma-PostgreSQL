/*
    * prisma/seed.ts
    * It seeds the database with initial data for development and testing.
    * This file creates a demo user and populates the database with sample notes.
    *
*/
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seeding...');

    // 1- Create a demo user
    // Demo user hashed password
    const hashedPassword = await bcrypt.hash('DemoUser123!', 10);

    // Create a demo user in the database
    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@example.com' },
        update: {},
        create: {
            email: 'demo@example.com',
            username: 'demouser',
            password: hashedPassword,
        },
    });

    console.log('Demo user created:', demoUser.email);

    // Sample notes data
    const notesData = [
        {
            title: 'Welcome to Your Notes App',
            content: 'This is your first note! You can create, edit, and delete notes to organize your thoughts and ideas. This note management system supports full CRUD operations with secure authentication.',
        },
        {
            title: 'Project Ideas',
            content: 'Here are some exciting project ideas to work on:\n\n• Build a task management app with React and Node.js\n• Create a personal blog with Next.js and MongoDB\n• Develop a weather dashboard using OpenWeatherMap API\n• Design a expense tracker with charts and analytics\n• Build a real-time chat application with Socket.io',
        },
        {
            title: 'Learning Goals for 2025',
            content: 'My learning objectives for this year:\n\n1. Master TypeScript and advanced JavaScript patterns\n2. Learn Docker and containerization\n3. Explore microservices architecture\n4. Get proficient with GraphQL and Apollo\n5. Study system design principles\n6. Contribute to open-source projects\n7. Build a production-ready full-stack application',
        },
        {
            title: 'Recipe: Homemade Pizza',
            content: 'Ingredients:\n• 2 cups all-purpose flour\n• 1 cup warm water\n• 1 tsp active dry yeast\n• 1 tsp salt\n• 2 tbsp olive oil\n• Pizza sauce\n• Mozzarella cheese\n• Your favorite toppings\n\nInstructions:\n1. Mix yeast with warm water, let sit for 5 minutes\n2. Combine flour and salt, add yeast mixture and olive oil\n3. Knead for 8-10 minutes until smooth\n4. Let rise for 1 hour\n5. Roll out, add toppings, bake at 475°F for 12-15 minutes',
        },
        {
            title: 'Book Recommendations',
            content: 'Must-read books for developers:\n\n📚 Technical Books:\n• "Clean Code" by Robert C. Martin\n• "Design Patterns" by Gang of Four\n• "System Design Interview" by Alex Xu\n• "You Don\'t Know JS" by Kyle Simpson\n\n📚 General Development:\n• "The Pragmatic Programmer" by Andy Hunt\n• "Atomic Habits" by James Clear\n• "The Lean Startup" by Eric Ries',
        },
        {
            title: 'Travel Plans',
            content: 'Places I want to visit:\n\n🌍 Europe:\n• Paris, France - Visit the Louvre and Eiffel Tower\n• Rome, Italy - Explore ancient history and cuisine\n• Amsterdam, Netherlands - Canals and museums\n\n🌏 Asia:\n• Tokyo, Japan - Experience modern culture and technology\n• Seoul, South Korea - K-pop culture and street food\n• Bangkok, Thailand - Temples and night markets\n\n🌎 Americas:\n• New York City, USA - Broadway shows and Central Park\n• Vancouver, Canada - Nature and city life balance',
        },
        {
            title: 'Daily Routine',
            content: '⏰ My ideal daily schedule:\n\n6:00 AM - Wake up, drink water\n6:30 AM - Morning workout or yoga\n7:30 AM - Shower and breakfast\n8:30 AM - Review daily goals\n9:00 AM - Deep work session (coding/writing)\n12:00 PM - Lunch break\n1:00 PM - Emails and communication\n2:00 PM - Meetings or collaborative work\n4:00 PM - Learning new skills\n6:00 PM - Dinner and family time\n8:00 PM - Reading or relaxation\n10:00 PM - Prepare for tomorrow, sleep',
        },
        {
            title: 'Health & Fitness Goals',
            content: '💪 My health objectives:\n\n🏃‍♂️ Exercise:\n• Run 3 times per week (5K minimum)\n• Strength training 2 times per week\n• Yoga or stretching daily\n• Try rock climbing or hiking monthly\n\n🥗 Nutrition:\n• Drink 8 glasses of water daily\n• Eat 5 servings of fruits and vegetables\n• Meal prep on Sundays\n• Limit processed foods and sugar\n\n😴 Sleep:\n• Get 7-8 hours of sleep nightly\n• No screens 1 hour before bed\n• Maintain consistent sleep schedule',
        },
        {
            title: 'Side Project: Weather App',
            content: '🌤️ Building a weather dashboard:\n\nFeatures to implement:\n• Current weather conditions\n• 7-day forecast\n• Interactive maps\n• Location-based weather alerts\n• Historical weather data\n• Weather widget for websites\n\nTech Stack:\n• Frontend: React with TypeScript\n• Backend: Node.js with Express\n• Database: PostgreSQL\n• API: OpenWeatherMap\n• Deployment: Vercel + Railway\n\nProgress:\n✅ API integration complete\n✅ Basic UI components\n🔄 Working on responsive design\n📅 Testing phase next week',
        },
        {
            title: 'Meeting Notes: Team Standup',
            content: '📅 Date: July 12, 2025\n👥 Attendees: Development Team\n\n🎯 Sprint Goals:\n• Complete user authentication module\n• Implement note search functionality\n• Add pagination to notes list\n• Write comprehensive tests\n• Update API documentation\n\n🚀 Yesterday\'s Progress:\n• Fixed authentication middleware bug\n• Added rate limiting to API endpoints\n• Improved error handling\n\n🎯 Today\'s Tasks:\n• Implement note sharing feature\n• Review pull requests\n• Update deployment scripts\n\n🚧 Blockers:\n• Waiting for database migration approval\n• Need design feedback on new UI components',
        },
        {
            title: 'Grocery List',
            content: '🛒 Shopping List:\n\n🥬 Vegetables:\n• Spinach\n• Broccoli\n• Bell peppers\n• Onions\n• Tomatoes\n• Carrots\n• Potatoes\n\n🍎 Fruits:\n• Bananas\n• Apples\n• Oranges\n• Berries\n\n🥛 Dairy:\n• Milk\n• Greek yogurt\n• Cheese\n• Eggs\n\n🍖 Protein:\n• Chicken breast\n• Salmon\n• Tofu\n• Beans\n\n🌾 Pantry:\n• Rice\n• Pasta\n• Bread\n• Olive oil\n• Spices',
        },
        {
            title: 'Debugging Tips',
            content: '🐛 Essential debugging strategies:\n\n1. **Read Error Messages Carefully**\n   • Don\'t skip the stack trace\n   • Look for line numbers and file names\n   • Understand the error type\n\n2. **Use Console Logging Effectively**\n   • Log variable values at different points\n   • Use descriptive log messages\n   • Remove logs before production\n\n3. **Divide and Conquer**\n   • Comment out code sections\n   • Test individual functions\n   • Use breakpoints strategically\n\n4. **Check Common Issues**\n   • Typos in variable names\n   • Missing imports or dependencies\n   • Incorrect data types\n   • Async/await issues\n\n5. **Use Developer Tools**\n   • Browser DevTools for frontend\n   • Network tab for API issues\n   • Database query logs\n   • IDE debugging features',
        },
        {
            title: 'Database Design Notes',
            content: '🗄️ Database Design Best Practices:\n\n**Normalization:**\n• 1NF: Eliminate repeating groups\n• 2NF: Remove partial dependencies\n• 3NF: Remove transitive dependencies\n\n**Indexing Strategy:**\n• Index frequently queried columns\n• Composite indexes for multi-column queries\n• Monitor index usage and performance\n\n**Relationships:**\n• One-to-One: User profile data\n• One-to-Many: User has many notes\n• Many-to-Many: Users can share notes\n\n**Data Types:**\n• Use appropriate sizes (VARCHAR vs TEXT)\n• Consider timezone for DATETIME fields\n• Use UUIDs for distributed systems\n\n**Security:**\n• Hash passwords with bcrypt\n• Validate input data\n• Use parameterized queries\n• Implement proper access controls',
        },
        {
            title: 'API Documentation Guidelines',
            content: '📚 Writing excellent API documentation:\n\n**Essential Elements:**\n• Clear endpoint descriptions\n• Request/response examples\n• Parameter specifications\n• Error code explanations\n• Authentication requirements\n\n**Best Practices:**\n• Use consistent formatting\n• Include code examples in multiple languages\n• Provide interactive testing tools\n• Keep documentation up-to-date\n• Add troubleshooting sections\n\n**Tools to Consider:**\n• Swagger/OpenAPI for REST APIs\n• Postman for testing and documentation\n• Insomnia for API development\n• GraphQL Playground for GraphQL APIs\n\n**Documentation Structure:**\n1. Quick start guide\n2. Authentication\n3. Endpoints reference\n4. Error handling\n5. Rate limiting\n6. SDKs and libraries\n7. Changelog',
        },
        {
            title: 'Code Review Checklist',
            content: '✅ Code Review Guidelines:\n\n**Functionality:**\n• Does the code work as intended?\n• Are edge cases handled?\n• Is error handling comprehensive?\n• Are there any potential bugs?\n\n**Code Quality:**\n• Is the code readable and well-organized?\n• Are variable names descriptive?\n• Is there proper commenting?\n• Are functions/methods single-purpose?\n\n**Performance:**\n• Are there any performance bottlenecks?\n• Is database usage optimized?\n• Are expensive operations necessary?\n• Could caching improve performance?\n\n**Security:**\n• Is user input properly validated?\n• Are there any security vulnerabilities?\n• Is sensitive data properly protected?\n• Are authentication checks in place?\n\n**Testing:**\n• Are there adequate unit tests?\n• Do integration tests cover key flows?\n• Are test cases comprehensive?\n• Is test coverage acceptable?\n\n**Style:**\n• Does code follow project conventions?\n• Is formatting consistent?\n• Are imports organized properly?',
        },
    ];

    // 2- Create notes for the demo user
    console.log('Creating sample notes...');

    // Map through notesData and create each note
    // Using upsert to avoid duplicates based on title
    for (const noteData of notesData) {
        const note = await prisma.note.upsert({
            where: {
                id: `note-${noteData.title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20)}`,
            },
            update: {},
            create: {
                title: noteData.title,
                content: noteData.content,
                userId: demoUser.id,
            },
        });

        console.log(`Created note: ${note.title}`);
    }

    // Final message after seeding
    console.log('Database seeding completed successfully!');
    console.log(`Summary:`);
    console.log(`1 user created (${demoUser.email})`);
    console.log(`${notesData.length} notes created`);
    console.log(`\n Demo login credentials:`);
    console.log(`Email: demo@example.com`);
    console.log(`Password: DemoUser123!`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('Error during seeding:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
