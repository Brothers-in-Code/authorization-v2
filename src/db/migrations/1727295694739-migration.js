const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Migration1727295694739 {
  name = 'Migration1727295694739';

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`expires_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`expires_date\` datetime NULL`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`expires_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`expires_date\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`expires_date\` \`expires_timestamp\` int NOT NULL`,
    );
  }
};
