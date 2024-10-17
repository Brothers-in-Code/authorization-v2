const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1729192940550 {
    name = 'Migration1729192940550'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`group\` ADD \`screen_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`group\` DROP COLUMN \`is_private\``);
        await queryRunner.query(`ALTER TABLE \`group\` ADD \`is_private\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP COLUMN \`is_scan\``);
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD \`is_scan\` int NOT NULL DEFAULT '0'`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP COLUMN \`is_scan\``);
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD \`is_scan\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`group\` DROP COLUMN \`is_private\``);
        await queryRunner.query(`ALTER TABLE \`group\` ADD \`is_private\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`group\` DROP COLUMN \`screen_name\``);
    }
}
