const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require("discord.js");
const { request } = require('undici');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("cat")
        .setDescription("Get a random cat image"),


    async execute(interaction) {


        const
            catResult = await request('https://aws.random.cat/meow'),
            { file } = await catResult.body.json();

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Random Cat`)
            .setImage(`${file}`)
            .setFooter({
                text: "Powered by https://aws.random.cat/",
                iconURL: "https://cataas.com/cat?width=32&height=32"
            });

        await interaction.reply({embeds: [embed]});
    }
}