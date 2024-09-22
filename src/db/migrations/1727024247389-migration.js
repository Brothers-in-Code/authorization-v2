const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1727024247389 {
    name = 'Migration1727024247389'

    async up(queryRunner) {
        await queryRunner.query(`DROP INDEX \`IDX_USER_USER_ID\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`user_id\` \`user_vkid\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`post\` CHANGE \`post_id\` \`post_vkid\` int NOT NULL`);
        await queryRunner.query(`CREATE TABLE \`group\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`group_vkid\` int NOT NULL, \`group_name\` varchar(255) NOT NULL, \`is_private\` tinyint NOT NULL, \`last_group_scan_date\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_e0d2882e4b10f26eafd9ecda24\` (\`user_vkid\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_USER_USER_VKID\` ON \`user\` (\`user_vkid\`)`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_be5fda3aac270b134ff9c21cdee\` FOREIGN KEY (\`id\`) REFERENCES \`group\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_be5fda3aac270b134ff9c21cdee\``);
        await queryRunner.query(`DROP INDEX \`IDX_USER_USER_VKID\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_e0d2882e4b10f26eafd9ecda24\``);
        await queryRunner.query(`DROP TABLE \`group\``);
        await queryRunner.query(`ALTER TABLE \`post\` CHANGE \`post_vkid\` \`post_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`user_vkid\` \`user_id\` int NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_USER_USER_ID\` ON \`user\` (\`user_id\`)`);
    }
}
