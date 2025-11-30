require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const reportRoutes = require('./routes/report');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Discord Bot Setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

// Make client available to routes
app.set('discordClient', client);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/report', reportRoutes);

// Bot Login
client.login(process.env.DISCORD_TOKEN).then(() => {
    console.log(`Logged in as ${client.user.tag}`);
}).catch(err => {
    console.error('Failed to login to Discord:', err);
});

// Start Server
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
    console.log('=================================');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ error: 'Internal Server Error (Global Handler)' });
});

// Bot Interactions (Close Ticket)
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'close_ticket') {
        const staffRole = process.env.STAFF_ROLE_ID;
        if (!interaction.member.roles.cache.has(staffRole)) {
            return interaction.reply({ content: 'Non hai il permesso di chiudere questo ticket.', ephemeral: true });
        }

        await interaction.reply({ content: 'Chiusura ticket in corso...', ephemeral: true });

        const channel = interaction.channel;
        const logChannelId = process.env.LOG_CHANNEL_ID;
        const logChannel = await client.channels.fetch(logChannelId);

        // Generate Transcript (Simplified for now)
        const messages = await channel.messages.fetch({ limit: 100 });
        const transcript = messages.reverse().map(m => `${m.author.tag}: ${m.content}`).join('\n');

        if (logChannel) {
            await logChannel.send({
                content: `Ticket chiuso da ${interaction.user.tag}`,
                files: [{
                    attachment: Buffer.from(transcript, 'utf-8'),
                    name: `transcript-${channel.name}.txt`
                }]
            });
        }

        setTimeout(() => {
            channel.delete().catch(console.error);
        }, 5000);
    }
});
