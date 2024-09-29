const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1727558631114 {
    name = 'Migration1727558631114'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP COLUMN \`group_id\``);
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP COLUMN \`user_id\``);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD \`user_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD \`group_id\` int NOT NULL`);
    }
}
