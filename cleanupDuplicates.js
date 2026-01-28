import mongoose from 'mongoose';
import Board from './models/Board.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Remove duplicate members from all boards
const removeDuplicateMembers = async () => {
    try {
        console.log('🔍 Finding boards with duplicate members...\n');

        const boards = await Board.find({});
        let totalFixed = 0;

        for (const board of boards) {
            const originalMemberCount = board.members.length;

            // Create a Set to track unique user IDs
            const seenUserIds = new Set();
            const uniqueMembers = [];

            // Filter out duplicates
            for (const member of board.members) {
                const userId = member.user.toString();

                if (!seenUserIds.has(userId)) {
                    seenUserIds.add(userId);
                    uniqueMembers.push(member);
                }
            }

            // If we found duplicates, update the board
            if (uniqueMembers.length < originalMemberCount) {
                board.members = uniqueMembers;
                await board.save();

                const duplicatesRemoved = originalMemberCount - uniqueMembers.length;
                totalFixed++;

                console.log(`✅ Board "${board.title}"`);
                console.log(`   - Original members: ${originalMemberCount}`);
                console.log(`   - Unique members: ${uniqueMembers.length}`);
                console.log(`   - Duplicates removed: ${duplicatesRemoved}\n`);
            }
        }

        if (totalFixed === 0) {
            console.log('✨ No duplicate members found! All boards are clean.\n');
        } else {
            console.log(`\n🎉 Successfully cleaned ${totalFixed} board(s)!\n`);
        }

    } catch (error) {
        console.error('❌ Error removing duplicates:', error);
    }
};

// Run the cleanup
const run = async () => {
    await connectDB();
    await removeDuplicateMembers();

    console.log('✅ Cleanup complete. Closing database connection...');
    await mongoose.connection.close();
    console.log('👋 Goodbye!');
};

run();
