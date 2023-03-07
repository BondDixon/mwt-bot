const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");
const profileModel = require("../../models/profileSchema");

const
    cooldownTime = 14400 * 1000,
    cooldownTimeSeconds = cooldownTime / 1000;

let cooldown;

module.exports = {

    data: new SlashCommandBuilder()
        .setName("rob-bank")
        .setDescription("Rob the Royal Bank of Military Warfare Tycoonia"),

    async execute(interaction) {

        // Clone the user collection in the database
        const allProfiles = await profileModel.find({});
        for (const profile of allProfiles) {

            // new collection with the same data
            await profileModel.create({
                userID: profile.userID,
                coins: profile.coins,
                bank: profile.bank,
                pocket: profile.pocket
            });
        }


        if (cooldown) {

            // Get the time remaining until the cooldown is over
            const
                timeRemaining = cooldown - new Date().getTime(),
                timeRemainingDate = new Date(new Date().getTime() + timeRemaining);

            return interaction.reply({
                content: `You are on cool down! Cooldown expires <t:${(timeRemainingDate.getTime() / 1000).toFixed(0)}:R>`,
                ephemeral: false
            })

        }

        cooldown = new Date().getTime() + cooldownTime;


        const
            successRate = 0.2,
            random = Math.random(),
            success = random < successRate;

        // get balance of the current user
        const profileData = await profileModel.findOne({userID: interaction.user.id});
        const userBalance = profileData.bank;

        let
            robbed = 0,
            newBankBalance = 0;


        if (success) {

            // Loop through everyone's bank balances and add a random amount to the robber's bank balance
            const allProfiles = await profileModel.find({});
            for (const profile of allProfiles) {

                // Up to 25% of the user's bank balance
                const
                    randomAmount = Math.round(Math.random() / 5 * profile.bank),
                    newBalance = profile.bank - randomAmount;

                // Update the user's bank balance
                await profileModel.findOneAndUpdate(
                    {userID: profile.userID},
                    {bank: newBalance}
                );

                // Add the random amount to the robber's bank balance
                robbed += randomAmount;
                newBankBalance += newBalance;

                const embed = new EmbedBuilder()
                    .setTitle("You robbed the bank!")
                    .setDescription(`You robbed ${randomAmount} coins from ${profile.userID}!`)
                    .setTimestamp()
                    .setFooter({
                        text: `Requested by ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL()
                    });

                await interaction.reply({embeds: [embed]});

                // Pin the bot's message
                const botMessage = await interaction.fetchReply();
                await botMessage.pin();

            }

        } else {

            // Subtract 10,000 from the robber's bank balance
            const newBalance = userBalance - 10000;
            await profileModel.findOneAndUpdate(
                {userID: interaction.user.id},
                {bank: newBalance}
            );
        }


    }
}

