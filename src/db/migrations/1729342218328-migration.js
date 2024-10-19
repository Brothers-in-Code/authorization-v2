const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1729342218328 {
    name = 'Migration1729342218328'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP FOREIGN KEY \`FK_1e61b4d2065f000f78a87138c4d\``);
        await queryRunner.query(`CREATE TABLE \`user_report\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`user_id\` int NULL, \`report_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP COLUMN \`report_id\``);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`name\` \`name\` varchar(100) NOT NULL DEFAULT '1 729 342 225 427'`);
        await queryRunner.query(`ALTER TABLE \`user_report\` ADD CONSTRAINT \`FK_3d355b3cbf05ae70386830ce05a\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_report\` ADD CONSTRAINT \`FK_eae411a4a5c228ad64b2c7ecba4\` FOREIGN KEY (\`report_id\`) REFERENCES \`report\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`user_report\` DROP FOREIGN KEY \`FK_eae411a4a5c228ad64b2c7ecba4\``);
        await queryRunner.query(`ALTER TABLE \`user_report\` DROP FOREIGN KEY \`FK_3d355b3cbf05ae70386830ce05a\``);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`name\` \`name\` varchar(100) NOT NULL DEFAULT '1 729 341 402 571'`);
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD \`report_id\` int NULL`);
        await queryRunner.query(`DROP TABLE \`user_report\``);
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD CONSTRAINT \`FK_1e61b4d2065f000f78a87138c4d\` FOREIGN KEY (\`report_id\`) REFERENCES \`report\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
