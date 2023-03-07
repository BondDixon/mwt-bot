const {
    SlashCommandBuilder, EmbedBuilder,
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("partner")
        .setDescription("Apply for partner status")
        .addStringOption(option =>
            option.setName("faction_name")
                .setDescription("The name of your faction")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("server_invite")
                .setDescription("The invite link to your server")
                .setRequired(true)),

    async execute(interaction) {

        const
            factionName = interaction.options.getString('faction_name'),
            serverInvite = interaction.options.getString('server_invite');

        // Create channel in partner-applications category
        const channel = await interaction.guild.channels.create(`partner-application-${factionName}`, {reason: 'Partner Application'})
            .then(console.log)
            .catch(console.error)
            .setParent('1079181815794905129');

        await channel.setParent('1079181815794905129');

        // set permissions
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: false
        });

        await channel.permissionOverwrites.edit(interaction.guild.users.cache.get(interaction.user.id), {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true
        });

        // Send message in channel
        const embed = new EmbedBuilder()
            .setTitle(`Partner Application - ${factionName}`)
            .setDescription(`**Server Invite:** ${serverInvite}`)
            .setFooter({
                text: `Application ID: ${channel.id}`,
                iconURL: interaction.user.displayAvatarURL({dynamic: true})
            })
            .setTimestamp();


        channel.send({content: `<@&882202202000578590>`, embeds: [embed]});

        interaction.reply({
            content: `Your application has been sent! You can view it in <#${channel.id}>`,
            ephemeral: true
        });

    }
}