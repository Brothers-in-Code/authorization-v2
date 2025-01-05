const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Migration1735836197482 {
  name = 'Migration1735836197482';

  async up(queryRunner) {
    await queryRunner.query(`
        ALTER TABLE \`postIndicators\`
        CHANGE COLUMN \`json\` \`indicatorsList\` JSON;
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
        ALTER TABLE \`postIndicators\`
        CHANGE COLUMN \`indicatorsList\` \`json\` JSON;    
    `);
  }
};
