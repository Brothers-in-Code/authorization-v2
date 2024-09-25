const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1727291764893 {
    name = 'Migration1727291764893'

    async up(queryRunner) {
        await queryRunner.query(`DROP INDEX \`IDX_e0d2882e4b10f26eafd9ecda24\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`expires_date\` \`expires_timestamp\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`expires_timestamp\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`expires_timestamp\` int NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`expires_timestamp\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`expires_timestamp\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`expires_timestamp\` \`expires_date\` datetime NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_e0d2882e4b10f26eafd9ecda24\` ON \`user\` (\`user_vkid\`)`);
    }
}
