const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Migration1733078710039 {
  name = 'Migration1733078710039';

  async up(queryRunner) {
    const table = await queryRunner.getTable('post');
    if (table) {
      const column = table.findColumnByName('json');
      if (column) {
        await queryRunner.query(`
                ALTER TABLE \`post\` MODIFY \`json\` JSON NOT NULL;
              `);
      }
    }
  }

  async down(queryRunner) {
    const table = await queryRunner.getTable('post');
    if (table) {
      const column = table.findColumnByName('json');
      if (column) {
        await queryRunner.query(`
                ALTER TABLE \`post\` MODIFY \`json\` longtext NOT NULL;
              `);
      }
    }
  }
};
