const {
        SlashCommandBuilder, EmbedBuilder
    } = require("discord.js"),
    database = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("list-factions")
        .setDescription("List all factions"),

    async execute(interaction) {

        const factionModel = require("../../models/factionSchema.js");

        const
            factions = await factionModel.find(),
            info = {}

        for (const faction of factions) {

            info[faction.factionName] = {
                name: faction.factionName,
                description: faction.factionDescription,
                invite: faction.factionInvite,
                members: faction.factionMembers.length
            }

        }

        const embed = new EmbedBuilder()
            .setTitle("Factions")
            .setDescription(`There are ${factions.length} factions\n`
                + Object.values(info).map(faction => `**${faction.name}**\n${faction.description}\n[Join ${faction.members} others!](${faction.invite})`).join("\n\n"))


            .setTimestamp()
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            });

        interaction.reply({embeds: [embed]});


    }
}