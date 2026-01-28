import mongoose from 'mongoose';
import Board from './models/Board.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const run = async () => {
    try {
        // Connect
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const boards = await Board.find({});
        let fixed = 0;
        const log = [];

        for (const board of boards) {
            const before = board.members.length;
            const seen = new Set();
            const unique = [];

            for (const m of board.members) {
                const uid = m.user.toString();
                if (!seen.has(uid)) {
                    seen.add(uid);
                    unique.push(m);
                }
            }

            if (unique.length < before) {
                board.members = unique;
                await board.save();
                fixed++;
                log.push(`Fixed "${board.title}": ${before} -> ${unique.length} members`);
                console.log(`✅ ${board.title}: removed ${before - unique.length} duplicate(s)`);
            }
        }

        if (fixed === 0) {
            console.log('✨ No duplicates found!');
        } else {
            console.log(`\n🎉 Cleaned ${fixed} board(s)!`);
        }

        fs.writeFileSync('cleanup-log.txt', log.join('\n'));

        await mongoose.connection.close();
        console.log('\n✅ Done!');

    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

run();
