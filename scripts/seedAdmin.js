/**
 * Admin Seed Script
 * 
 * Creates an admin user in the database.
 * Run once with: node scripts/seedAdmin.js
 * 
 * IMPORTANT: Change the password before running in production!
 */
require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');

// Database connection
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH || '../database.sqlite',
    logging: false,
});

// User model (minimal definition for seeding)
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
    },
    api_key: {
        type: DataTypes.STRING,
        unique: true,
    },
}, {
    tableName: 'Users',
    timestamps: true,
});

async function seedAdmin() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Admin credentials - CHANGE IN PRODUCTION
        const adminUsername = 'admin';
        const adminPassword = 'admin123';

        // Check if admin exists
        const existingAdmin = await User.findOne({ where: { username: adminUsername } });

        if (existingAdmin) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Create admin
        await User.create({
            username: adminUsername,
            password: hashedPassword,
            role: 'admin',
            api_key: null, // Admins don't need API keys
        });

        console.log('✅ Admin user created successfully!');
        console.log(`   Username: ${adminUsername}`);
        console.log(`   Password: ${adminPassword}`);
        console.log('   ⚠️  Change password in production!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
