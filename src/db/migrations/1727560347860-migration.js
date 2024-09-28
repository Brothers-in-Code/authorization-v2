const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1727560347860 {
    name = 'Migration1727560347860'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`group\` DROP COLUMN \`group_name\``);
        await queryRunner.query(`ALTER TABLE \`group\` DROP COLUMN \`group_vkid\``);
        await queryRunner.query(`ALTER TABLE \`group\` ADD \`vkid\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`group\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`group\` CHANGE \`last_group_scan_date\` \`last_group_scan_date\` datetime NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`group\` CHANGE \`last_group_scan_date\` \`last_group_scan_date\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`group\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`group\` DROP COLUMN \`vkid\``);
        await queryRunner.query(`ALTER TABLE \`group\` ADD \`group_vkid\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`group\` ADD \`group_name\` varchar(255) NOT NULL`);
    }
}
