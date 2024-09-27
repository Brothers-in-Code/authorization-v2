const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1727299931714 {
    name = 'Migration1727299931714'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`device_id\` varchar(1000) NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`device_id\``);
    }
}
