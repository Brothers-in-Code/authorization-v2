const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1726953449651 {
    name = 'Migration1726953449651'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`group_id\` int NOT NULL, \`post_id\` int NOT NULL, \`created_at\` datetime NOT NULL, \`updated_at\` datetime NOT NULL, \`deleted_at\` datetime NOT NULL, \`json\` json NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE \`post\``);
    }
}
