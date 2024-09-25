const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1727296069324 {
    name = 'Migration1727296069324'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`expires_date\` datetime NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`expires_date\``);
    }
}
