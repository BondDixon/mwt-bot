const {
    SlashCommandBuilder,
    Events,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    Client
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("advertise")
        .setDescription("Advertise your faction"),

    async execute(interaction) {

        // get ../../data/config.json
        const config = require("../../data/config.json");

        // check json
        if (config[interaction.user.id.toString()] === undefined) {
            const logo = "https://cdn.discordapp.com/ephemeral-attachments/1079132532207013989/1079134986436890764/126355137.png";
        }

        else {
            const logo = config[interaction.user.id.toString()];
            console.log(logo);
        }

        const
            modal = new ModalBuilder()
                .setCustomId('factionAdvert')
                .setTitle('Advertise your faction!'),

            factionNameInput = new TextInputBuilder()
                .setCustomId('factionNameInput')
                .setLabel("Faction Name")
                .setStyle(TextInputStyle.Short),

            factionDescriptionInput = new TextInputBuilder()
                .setCustomId('factionDescriptionInput')
                .setLabel("Faction Description")
                .setStyle(TextInputStyle.Paragraph),

            factionInviteInput = new TextInputBuilder()
                .setCustomId('factionInviteInput')
                .setLabel("Faction Invite (Discord invite link)")
                .setStyle(TextInputStyle.Short);


        const
            firstActionRow = new ActionRowBuilder().addComponents(factionNameInput),
            secondActionRow = new ActionRowBuilder().addComponents(factionDescriptionInput),
            thirdActionRow = new ActionRowBuilder().addComponents(factionInviteInput);


        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);

    }
}

