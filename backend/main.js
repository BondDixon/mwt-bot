require('dotenv').config();

// get all from shares.js
const
    {Client, Events, GatewayIntentBits, report, fs, Collection} = require('./shared.js'),
    {EmbedBuilder, MessageActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js"),
    token = process.env.TOKEN,
    client = new Client({
        intents: Object.values(GatewayIntentBits).reduce((a, b) => a | b, 0),
    }),
    mongoose = require('mongoose');
const profileModel = require("../models/profileSchema");
const {request} = require("undici");

// Database

client.on(Events.InteractionCreate, async interaction => {

    let profileData;

    try {
        profileData = await profileModel.findOne({userID: interaction.user.id});
        if (!profileData) {
            let profile = await profileModel.create({
                userID: interaction.user.id,
                coins: 1250,
                bank: 0,
                pocket: 1250
            });

            await profile.save();
        }
    } catch (err) {
        console.log(err);
    }

    const
        user = await client.users.fetch(interaction.user.id),
        profilePicture = user.avatarURL({format: "png", dynamic: true, size: 1024});

    switch (interaction.type) {

        case 2:

            const command = client.commands.get(interaction.commandName);
            try {
                console.log(`Executing command ${interaction.commandName} for ${interaction.user.tag} (${interaction.user.id})`);
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: `There was an error while executing this command! Error: \`\`\`${error.stack}\`\`\``,
                    ephemeral: true
                });
            }
            break;

        case 3:

            // if starts with join_
            if (interaction.customId.startsWith('join_')) {
                const invite = interaction.customId.split('_')[1];
                await interaction.reply({
                    content: `Invite: ${invite}`,
                    ephemeral: true
                });
            }


            break;

        case 5:
            if (interaction.customId === 'factionAdvert') {
                const
                    factionName = interaction.fields.getTextInputValue('factionNameInput'),
                    factionDescription = interaction.fields.getTextInputValue('factionDescriptionInput')

                let
                    factionInvite = interaction.fields.getTextInputValue('factionInviteInput');

                // Check if faction invite is a valid URL
                if (!factionInvite.startsWith('http')) {
                    factionInvite = `https://${factionInvite}`
                }

                let factionLogo;

                // get ../../data/config.json
                const config = require("../data/config.json");

                // check json
                if (config[interaction.user.id.toString()] === undefined) {
                    factionLogo = "https://cdn.discordapp.com/ephemeral-attachments/1079132532207013989/1079134986436890764/126355137.png";
                } else {
                    factionLogo = config[interaction.user.id.toString()];
                }

                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setAuthor({
                        name: factionName,
                        iconURL: factionLogo
                    })
                    .setImage(factionLogo)
                    .setTitle(`${factionName}`)
                    .setDescription(factionDescription)
                    .setFooter({
                        text: `Submitted by ${user.tag}`,
                        iconURL: profilePicture
                    });

                // Add a button to the embed

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`join_${factionInvite}`)
                            .setLabel('Join | 0 so far')
                            .setStyle(ButtonStyle.Primary)
                    );

                // send in channel with id 1078745396450430976
                const channel = await client.channels.fetch('1078745396450430976');
                await channel.send({embeds: [embed], components: [row]});

                await interaction.reply({content: 'Your faction advert has been sent!', ephemeral: true});
                break;

            }


    }
});


/*
    ====================================================================================================================
    COMMAND HANDLER /// COMMAND HANDLER /// COMMAND HANDLER /// COMMAND HANDLER /// COMMAND HANDLER /// COMMAND HANDLER
    ====================================================================================================================
*/

// Command Location: ../commands/*

client.commands = new Collection();

function load_commands(category) {

    const
        directory = `../commands/${category}/`,
        files = fs.readdirSync(directory);

    for (const file of files) {
        report.log(`Loading command ${file}`);
        const
            command = require(`${directory}${file}`),
            command_name = file.split('.')[0];
        client.commands.set(command_name, command);
        report.log(`Loaded command ${file} as ${command_name}`);
    }

}

// Log in to Discord with env
client.login(token).then(r =>
    report.log('Logged in!')
).catch(e =>
    report.error('Failed to log in!', e)
);


client.once(Events.ClientReady, c => {
    report.log(`Ready! Logged in as ${c.user.tag}`);
    report.log("Loading commands...");

    // Loop through all subfolders in commands
    // and load all commands

    const categories = fs.readdirSync('../commands/');
    for (const category of categories) {
        load_commands(category);
    }
});

function updateMemberCount(member) {
    const
        memberCount = member.guild.memberCount,
        memberCountChannelId = '1078740103452688506',
        memberCountChannel = member.guild.channels.cache.get(memberCountChannelId);

    memberCountChannel.setName(`Members: ${memberCount}`);
}

client.on('guildMemberAdd', async member => {

    const
        catResult = await request('https://aws.random.cat/meow'),
        {file} = await catResult.body.json();

    const
        welcome_channel = member.guild.channels.cache.find(channel => channel.name === 'welcomes'),
        role = member.guild.roles.cache.find(role => role.name === 'Exchange Member');

    const memberCount = member.guild.memberCount;
    const suffix = memberCount === 1 ? 'st' : memberCount === 2 ? 'nd' : memberCount === 3 ? 'rd' : 'th';

    let welcome_embed = new EmbedBuilder()
        .setTitle('Welcome!')
        .setDescription(`Welcome to the server, **<@${member.user.id}>!** You're the ${member.guild.memberCount}${suffix} member!`)
        .setImage(file)
        .setColor(0x00ff00)
        .setTimestamp();

    updateMemberCount(member)

    welcome_channel.send({embeds: [welcome_embed]});
    member.roles.add(role);


    // Economy

    const profileModel = require('../models/profileSchema');
    module.exports = async (client, Discord, member) => {
        let profile = await profileModel.create({
            userID: member.id,
            coins: 1250,
            bank: 0,
            pocket: 1250
        });

        await profile.save();

        console.log("Profile created for " + member.user.tag);
    }


});

client.on('guildMemberRemove', async member => {

    const
        catResult = await request('https://aws.random.cat/meow'),
        {file} = await catResult.body.json();

    const
        welcome_channel = member.guild.channels.cache.find(channel => channel.name === 'welcomes'),
        role = member.guild.roles.cache.find(role => role.name === 'Exchange Member');

    let welcome_embed = new EmbedBuilder()
        .setTitle('Goodbye!')
        .setDescription(`Goodbye, **${member.user.tag}!**`)
        .setImage(file)
        .setColor(0xff0000)
        .setTimestamp();

    updateMemberCount(member)

    welcome_channel.send({embeds: [welcome_embed]});
});

client.on('messageCreate', async message => {

    // react with nerd
    if (message.content.toLowerCase().includes('nerd')) {
        await message.react('🤓');
        // then hsield
        message.react('🛡️');
    }

});

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_SRC, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB!')
}).catch((err) => {
    console.log('Failed to connect to MongoDB!')
    console.log(err)
})

process.on('uncaughtException', function (error) {
    console.log(error.stack);
});
