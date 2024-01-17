
// —— dot. 
const { Signale } = require('signale');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const logger = new Signale({ scope: 'Discord' });
const config = require('../config.js');
const pool = require('../pool.js');

module.exports = {
    name: "guildMemberAdd",

    async execute(member) {
        const domain = config.server.domain === 'localhost' ? `${config.server.domain}:${config.server.httpPort}` : `${config.server.domain}`;
        if (config.Discord.rulesEnabled) {
            const linkID = pool.createLink(member.id);
            const captchaEmbed = new EmbedBuilder()
                .setColor('#1a4143')
                .setDescription("<:ward:1197218187880714290> **Vérification Captcha**\nPour accéder au serveur, vous devez compléter le captcha ci-dessous.\nCe lien expirera dans **15 minutes**.")

            const button = new ButtonBuilder()
                .setURL(`${config.server.https ? 'https://' : 'http://'}${domain}/verify/${linkID}`)
                .setLabel("Accéder au captcha")

            const row = new ActionRowBuilder()
                .addComponents(button)

            member.send({ embeds: [captchaEmbed], components: [row] }).catch(() => {
                logger.error(`Failed to send captcha to user! (Maybe they have DMs turned off?)`);
            });

        } else {
            const linkID = pool.createLink(member.id);
            const captchaEmbed = new EmbedBuilder()
                .setColor('#1a4143')
                .setDescription("<:ward:1197218187880714290> **Vérification Captcha**\nPour accéder au serveur, vous devez compléter le captcha ci-dessous.\nCe lien expirera dans **15 minutes**.")

            const button = new ButtonBuilder()
                .setURL(`${config.server.https ? 'https://' : 'http://'}${domain}/verify/${linkID}`)
                .setLabel("Accéder au captcha")

            const row = new ActionRowBuilder()
                .addComponents(button)

            member.send({ embeds: [captchaEmbed], components: [row] }).catch(() => {
                logger.error(`Failed to send captcha to user! (Maybe they have DMs turned off?)`);
            });
        }

    },
};
