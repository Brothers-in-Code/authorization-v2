const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1727009973545 {
    name = 'Migration1727009973545'

    async up(queryRunner) {
        await queryRunner.query(`DROP INDEX \`IDX_758b8ce7c18b9d347461b30228\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`access_token\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`access_token\` varchar(1000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`refresh_token\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`refresh_token\` varchar(1000) NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`refresh_token\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`refresh_token\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`access_token\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`access_token\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_758b8ce7c18b9d347461b30228\` ON \`user\` (\`user_id\`)`);
    }
}
