const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1728416310832 {
    name = 'Migration1728416310832'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`userSubscription\` DROP FOREIGN KEY \`FK_6ca3488df244b47b5b01033de79\``);
        await queryRunner.query(`DROP INDEX \`REL_6ca3488df244b47b5b01033de7\` ON \`userSubscription\``);
        await queryRunner.query(`ALTER TABLE \`userSubscription\` DROP COLUMN \`permission\``);
        await queryRunner.query(`ALTER TABLE \`userSubscription\` ADD \`subscription\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`userSubscription\` ADD UNIQUE INDEX \`IDX_c6be1f2cba5ee4da18e3432c5b\` (\`user_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_c6be1f2cba5ee4da18e3432c5b\` ON \`userSubscription\` (\`user_id\`)`);
        await queryRunner.query(`ALTER TABLE \`userSubscription\` ADD CONSTRAINT \`FK_c6be1f2cba5ee4da18e3432c5be\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`userSubscription\` DROP FOREIGN KEY \`FK_c6be1f2cba5ee4da18e3432c5be\``);
        await queryRunner.query(`DROP INDEX \`REL_c6be1f2cba5ee4da18e3432c5b\` ON \`userSubscription\``);
        await queryRunner.query(`ALTER TABLE \`userSubscription\` DROP INDEX \`IDX_c6be1f2cba5ee4da18e3432c5b\``);
        await queryRunner.query(`ALTER TABLE \`userSubscription\` DROP COLUMN \`subscription\``);
        await queryRunner.query(`ALTER TABLE \`userSubscription\` ADD \`permission\` tinyint NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_6ca3488df244b47b5b01033de7\` ON \`userSubscription\` (\`user_id\`)`);
        await queryRunner.query(`ALTER TABLE \`userSubscription\` ADD CONSTRAINT \`FK_6ca3488df244b47b5b01033de79\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
