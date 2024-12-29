const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Migration1735160938633 {
  name = 'Migration1735160938633';

  async up(queryRunner) {
    await queryRunner.query(
      'ALTER TABLE `usersubscription` ADD `end_date` timestamp;',
    );
    await queryRunner.query(
      'ALTER TABLE `usersubscription` ALTER COLUMN `subscription` SET DEFAULT 0;',
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      'ALTER TABLE `usersubscription` DROP COLUMN `end_date`;',
    );
  }
};
