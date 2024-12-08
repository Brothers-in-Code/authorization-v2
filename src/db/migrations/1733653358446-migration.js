const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Migration1733653358446 {
  name = 'Migration1733653358446';

  async up(queryRunner) {
    await queryRunner.query('ALTER TABLE `post` ADD `keywords` varchar(255);');
  }

  async down(queryRunner) {
    await queryRunner.query('ALTER TABLE `post` DROP COLUMN `keywords`;');
  }
};
