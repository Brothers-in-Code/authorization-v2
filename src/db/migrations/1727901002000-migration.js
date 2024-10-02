const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1727901002000 {
    name = 'Migration1727901002000'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`post\` CHANGE \`group_id\` \`group_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_be5fda3aac270b134ff9c21cdee\` FOREIGN KEY (\`id\`) REFERENCES \`group\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_be5fda3aac270b134ff9c21cdee\``);
        await queryRunner.query(`ALTER TABLE \`post\` CHANGE \`group_id\` \`group_id\` int NULL`);
    }
}
