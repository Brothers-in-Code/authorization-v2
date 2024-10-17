const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Migration1728931088367 {
  name = 'Migration1728931088367';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE \`post\` ADD \`likes\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`post\` ADD \`views\` int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD \`timestamp_post\` bigint NOT NULL`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE \`post\` DROP COLUMN \`timestamp_post\``,
    );
    await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`views\``);
    await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`likes\``);
  }
};
