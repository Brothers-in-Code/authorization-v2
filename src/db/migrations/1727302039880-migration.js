const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Migration1727302039880 {
  name = 'Migration1727302039880';

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`expires_date\``,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`device_id\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`device_id\` varchar(1000) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`expires_date\` datetime NULL`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`expires_date\``,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`device_id\``);
  }
};
