const {
    SlashCommandBuilder, EmbedBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get help with the bot"),

    async execute(interaction) {

        const embed_admin = new EmbedBuilder()
            .setTitle(`Admin Commands`)
            .setDescription(
                `**/announce <announcement> <title> <channel>** - Announce something to a channel
            **/ban <user> <reason>** - Ban a user`
            )

        const embed_moderation = new EmbedBuilder()
            .setTitle(`Moderation Commands`)
            .setDescription(
                `**/kick <user> <reason>** - Kick a user
            **/mute <user> <reason>** - Mute a user
            **/purge <amount>** - Purge messages
            **/warn <user> <reason>** - Warn a user`
            )

        const embed_economy = new EmbedBuilder()
            .setTitle(`Economy Commands`)
            .setDescription(
                `**/balance** - Get your balance
            **/work** - Work for money
            **/deposit <amount>** - Deposit money into your bank
            **/withdraw <amount>** - Withdraw money from your bank
            **/leaderboard** - Get the top 10 richest users
            **/rob <user>** - Rob a user
            **/refresh_me** - Refresh your user`
            )

        const embed_factions = new EmbedBuilder()
            .setTitle(`Factions Commands`)
            .setDescription(
                `**/factions** - Get a list of all factions
            **/factions create <faction_name>** - Create a faction
            **/factions delete <faction_name>** - Delete a faction
            **/factions join <faction_name>** - Join a faction
            **/factions leave <faction_name>** - Leave a faction
            **/advertise** - Advertise your faction
            **/partner** - Apply for partner status`
            )

        const embed_fun = new EmbedBuilder()
            .setTitle(`Fun Commands`)
            .setDescription(`**/cat** - Get a random cat image`)

        interaction.reply({embeds: [embed_admin, embed_moderation, embed_economy, embed_factions, embed_fun]});
    }
}