
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../../../config.js");
const pool = require("../../../pool.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("verify")
		.setDescription(
			"Permet de se vérifier"
		),

	async execute(interaction) {
        const domain = config.server.domain === 'localhost' ? `${config.server.domain}:${config.server.httpPort}` : `${config.server.domain}`; 

        if(interaction.member.roles.cache.some(r => r.id === config.Discord.verifiedRole)) {
            await interaction.reply({ephemeral: true, content: "Vous êtes déjà vérifié."});
            return;
        }

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("rules")
                .setLabel('Agree')
                .setEmoji('✅')
                .setStyle(1)
            )

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Rules')
            .setDescription(config.Discord.rules);

        if(config.Discord.rulesEnabled) {
            await interaction.reply('Please check your DMS!')

            const linkID = pool.createLink(interaction.user.id);

            const captchaEmbed = new EmbedBuilder()
                .setColor('#1a4143')
                .setDescription("<:ward:1197218187880714290> **Vérification Captcha**\nPour accéder au serveur, vous devez compléter le captcha ci-dessous.\nCe lien expirera dans **15 minutes**.")

            const button = new ButtonBuilder()
                .setURL(`${config.server.https ? 'https://' : 'http://'}${domain}/verify/${linkID}`)
                .setLabel("Accéder au captcha")
                .setStyle(ButtonStyle.Link)

            const row = new ActionRowBuilder()
                .addComponents(button)

            await interaction.user.createDM().then(async (dm) => {
                await dm.send({ embeds: [captchaEmbed], components: [row] }).catch(() => {
                    logger.error(`Failed to send captcha to user! (Maybe they have DMs turned off?)`);
                });
            });

        } else {
            await interaction.reply({ephemeral: true, content: "Regardez vos DM!"})

            const linkID = pool.createLink(interaction.user.id);

            const captchaEmbed = new EmbedBuilder()
                .setColor('#1a4143')
                .setDescription("<:ward:1197218187880714290> **Vérification Captcha**\nPour accéder au serveur, vous devez compléter le captcha ci-dessous.\nCe lien expirera dans **15 minutes**.")

            const button = new ButtonBuilder()
                .setURL(`${config.server.https ? 'https://' : 'http://'}${domain}/verify/${linkID}`)
                .setLabel("Accéder au captcha")
                .setStyle(ButtonStyle.Link)

            const row = new ActionRowBuilder()
                .addComponents(button)

            await interaction.user.createDM().then(async (dm) => {
                await dm.send({ embeds: [captchaEmbed], components: [row] }).catch(() => {
                    logger.error(`Failed to send captcha to user! (Maybe they have DMs turned off?)`);
                })

            });
        }
    },
};