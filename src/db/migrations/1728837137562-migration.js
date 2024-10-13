const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1728837137562 {
    name = 'Migration1728837137562'

    async up(queryRunner) {
        await queryRunner.query(`DROP INDEX \`IDX_c6be1f2cba5ee4da18e3432c5b\` ON \`userSubscription\``);
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD \`is_scan\` tinyint NOT NULL DEFAULT '0'`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP COLUMN \`is_scan\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_c6be1f2cba5ee4da18e3432c5b\` ON \`userSubscription\` (\`user_id\`)`);
    }
}
