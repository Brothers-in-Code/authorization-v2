const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Migration1727533547661 {
  name = 'Migration1727533547661';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE \`user_group\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`user_id\` int NOT NULL, \`group_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    // await queryRunner.query(
    //   `ALTER TABLE \`group\` ADD \`photo\` varchar(1000) NULL`,
    // );
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE \`group\` DROP COLUMN \`photo\``);
    await queryRunner.query(`DROP TABLE \`user_group\``);
  }
};
