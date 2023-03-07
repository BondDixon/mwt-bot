const {
        SlashCommandBuilder,
        EmbedBuilder
    } = require("discord.js");

const profileModel = require("../../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deposit")
        .setDescription("Deposit money into your bank account")
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("The amount of money you want to deposit")
                .setRequired(false)
        ),

    async execute(interaction) {

        const
            profileData = await profileModel.findOne({userID: interaction.user.id});

        // amount = user cash or amount
        let
            userCash = profileData.currency,
            amount = /* cash if amount is undefined */ userCash;

        // if amount is defined, set amount to amount
        if (interaction.options.getInteger("amount")) {
            amount = interaction.options.getInteger("amount");
        }



        const
            taxRate = 0.05,
            taxed = Math.round(amount * taxRate),
            untaxed = amount - taxed;




        if (amount <= 0) return interaction.reply({content: "You can't deposit less than 0", ephemeral: true});
        if (amount % 1 !== 0) return interaction.reply({content: "You can't deposit fractions", ephemeral: true});

        // chcek if user has enough money

        if (amount > profileData.currency) return interaction.reply({
            content: "You don't have enough money to deposit that much",
            ephemeral: true
        });


        try {
            await profileModel.findOneAndUpdate({
                userID: interaction.user.id
            }, {
                $inc: {
                    currency: -amount,
                    bank: untaxed
                }
            });

            await profileModel.findOneAndUpdate({
                userID: 729567972070391848
            }, {
                $inc: {
                    bank: taxed
                }
            });

            const embed = new EmbedBuilder()
                .setTitle("Deposit")
                .setDescription(`You deposited $${amount.toLocaleString()} into your bank account. You payed fees of 5% ($${taxed.toLocaleString()})`)
                .setTimestamp()
                .setFooter({
                    text: `Requested by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL()
                });

            interaction.reply({embeds: [embed]});
        } catch (err) {
            console.log(err);
        }
    }
}