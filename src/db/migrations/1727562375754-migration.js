const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Migration1727562375754 {
  name = 'Migration1727562375754';

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE \`user_group\` ADD \`user_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_group\` ADD \`group_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_group\` ADD CONSTRAINT \`FK_7ded8f984bbc2ee6ff0beee491b\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_group\` ADD CONSTRAINT \`FK_bb9982562cca83afb76c0ddc0d6\` FOREIGN KEY (\`group_id\`) REFERENCES \`group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE \`user_group\` DROP FOREIGN KEY \`FK_bb9982562cca83afb76c0ddc0d6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_group\` DROP FOREIGN KEY \`FK_7ded8f984bbc2ee6ff0beee491b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_group\` DROP COLUMN \`group_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_group\` DROP COLUMN \`user_id\``,
    );
  }
};
