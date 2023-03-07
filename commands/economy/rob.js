const {
        SlashCommandBuilder,
        EmbedBuilder
    } = require("discord.js");
const profileModel = require("../../models/profileSchema");

const cooldown = new Set();
const cooldownTime = 600 * 1000;


module.exports = {
    data: new SlashCommandBuilder()
        .setName("rob")
        .setDescription("Rob someone")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("The user you want to rob")
                .setRequired(true)
        ),

    async execute(interaction) {

        if (cooldown.has(interaction.user.id)) {
            return interaction.reply({
                content: `You are on cool down! Please wait ${cooldownTime / 1000} seconds`,
                ephemeral: true
            });
        }

        cooldown.add(interaction.user.id);
        setTimeout(() => {
            cooldown.delete(interaction.user.id);
        }, cooldownTime);


        const
            target = interaction.options.getUser("target");

        let targetData;

        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: "You can't rob yourself!",
                ephemeral: true
            });
        }

        try {
            targetData = await profileModel.findOne({userID: target.id});

            if (!targetData) {
                return interaction.reply({
                    content: "That user doesn't have a profile yet!",
                    ephemeral: true
                });
            }

            const
                targetCash = targetData.currency,
                robbed = Math.round(Math.random() / 2 * targetCash)

            if (robbed === 0) {
                const embed = new EmbedBuilder()
                    .setTitle("Rob")
                    .setDescription(`You tried to rob ${target.tag} but failed!`)
                    .setTimestamp()
                    .setFooter({
                        text: `Requested by ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL()
                    })

                return interaction.reply({embeds: [embed]});
            }

            const embed = new EmbedBuilder()
                .setTitle("Rob")
                .setDescription(`You robbed ${target.tag} and got away with $${robbed.toLocaleString()}`)
                .setTimestamp()
                .setFooter({
                    text: `Requested by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL()
                })

            const response = await profileModel.findOneAndUpdate(
                {
                    userID: interaction.user.id,
                },
                {
                    $inc: {currency: robbed}
                }
            )

            await profileModel.findOneAndUpdate(
                {
                    userID: target.id
                },
                {
                    $inc: {
                        currency: -robbed
                    }
                }
            )

            return interaction.reply({
                content: `<@${target.id}>`,
                embeds: [embed]
            })


        } catch (err) {
            console.log(err);
            return interaction.reply({
                content: "There was an error executing this command!",
                ephemeral: true
            });
        }

    }
}