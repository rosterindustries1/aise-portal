const express = require('express');
const router = express.Router();
const multer = require('multer');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField } = require('discord.js');
const path = require('path');
const axios = require('axios');

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Ensure uploads dir exists
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

router.post('/submit', upload.array('evidence'), async (req, res) => {
    const { discordId, discordUsername, robloxUsername, title, description } = req.body;
    const client = req.app.get('discordClient');

    console.log('--- NEW REPORT SUBMISSION ---');
    console.log('User:', discordUsername, `(${discordId})`);
    console.log('Body:', req.body);
    console.log('Files:', req.files.length);

    // For now, let's try to find the guild from cache if env is missing
    const guild = client.guilds.cache.first();
    if (!guild) {
        console.error('Bot is not in any guild!');
        return res.status(500).json({ error: 'Bot not in any guild' });
    }
    console.log('Guild found:', guild.name, guild.id);

    try {
        // 1. Resolve Roblox Username to ID
        let robloxId = 'Unknown';
        let robloxProfileLink = `https://www.roblox.com/search/users?keyword=${robloxUsername}`;

        try {
            const robloxResponse = await axios.post('https://users.roblox.com/v1/usernames/users', {
                usernames: [robloxUsername],
                excludeBannedUsers: true
            });

            if (robloxResponse.data.data && robloxResponse.data.data.length > 0) {
                const user = robloxResponse.data.data[0];
                robloxId = user.id;
                robloxProfileLink = `https://www.roblox.com/users/${robloxId}/profile`;
            }
        } catch (robloxError) {
            console.warn('Failed to resolve Roblox ID:', robloxError.message);
        }
        console.log('Roblox ID resolved:', robloxId);

        // Use Env vars or Fallback to hardcoded IDs (since .env might be failing)
        const categoryId = process.env.CATEGORY_ID || '1279024933560782919';
        const staffRoleId = process.env.STAFF_ROLE_ID || '1248325686662402108';

        console.log('Using Category ID:', categoryId);
        console.log('Using Staff Role ID:', staffRoleId);

        if (!categoryId || !staffRoleId) {
            console.error('Missing Configuration: Category ID or Staff Role ID');
            return res.status(500).json({ error: 'Server configuration error: Missing IDs' });
        }

        // Sanitize username for channel name (lowercase, alphanumeric only, no dashes, no numbers from discriminator)
        const usernamePart = discordUsername.split('#')[0];
        const sanitizedUsername = usernamePart.toLowerCase().replace(/[^a-z0-9]/g, '');
        const channelName = `ticket-${sanitizedUsername}`;

        // Ensure cache is up to date
        await guild.channels.fetch();

        console.log('=== DUPLICATE TICKET CHECK ===');
        console.log('Looking for existing ticket:', channelName);
        console.log('Category ID:', categoryId);

        // Check if a channel with this name already exists in the category
        const existingChannel = guild.channels.cache.find(c =>
            c.parentId === categoryId &&
            c.name === channelName
        );

        if (existingChannel) {
            console.log(`✓ Ticket already exists: ${existingChannel.name}`);
            return res.status(400).json({ error: `Hai già un ticket aperto: ${existingChannel.name}. Chiudilo prima di aprirne un altro.` });
        }

        console.log('✓ No existing ticket found, proceeding with creation');

        const channel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: categoryId,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: staffRoleId,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                },
            ],
        });

        console.log(`✓ Channel created: ${channel.name}`);

        // Try to add user permission after creation
        if (discordId && discordId.length > 15) {
            try {
                await channel.permissionOverwrites.create(discordId, {
                    ViewChannel: true,
                    SendMessages: true
                });
                console.log(`✓ Added user ${discordId} to channel permissions`);
            } catch (e) {
                console.warn('Could not add user to channel:', e.message);
            }
        }

        // Create Embed
        const embed = new EmbedBuilder()
            .setTitle(`Nuova Segnalazione: ${title}`)
            .setColor('#c41e3a')
            .addFields(
                { name: 'Utente Discord', value: `<@${discordId}>`, inline: true },
                { name: 'Utente Roblox', value: `[${robloxUsername}](${robloxProfileLink}) (ID: ${robloxId})`, inline: true },
                { name: 'Descrizione', value: description }
            )
            .setTimestamp();

        // Create Button
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('Chiudi Ticket')
                    .setStyle(ButtonStyle.Danger)
            );

        // Prepare Attachments
        const files = req.files.map(file => file.path);

        await channel.send({
            content: `<@${discordId}> <@&${staffRoleId}>`,
            embeds: [embed],
            components: [row],
            files: files
        });

        res.json({ success: true, channelId: channel.id });

    } catch (error) {
        console.error('CRITICAL ERROR creating ticket:', error);
        // Return the specific error message to the frontend
        res.status(500).json({ error: `Server Error: ${error.message}` });
    }
});

module.exports = router;
