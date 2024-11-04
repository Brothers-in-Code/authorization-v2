const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Migration1729626322579 {
  name = 'Migration1729626322579';

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_8bb2bc4a3d9c55e031bc5d015c5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`report\` CHANGE \`comment_id\` \`description\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`report\` CHANGE \`name\` \`name\` varchar(100) NOT NULL DEFAULT '1 729 626 324 601'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`report\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`report\` ADD \`description\` varchar(1000) NOT NULL`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE \`report\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`report\` ADD \`description\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`report\` CHANGE \`name\` \`name\` varchar(100) NOT NULL DEFAULT '1 729 371 718 798'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`report\` CHANGE \`description\` \`comment_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`report\` ADD CONSTRAINT \`FK_8bb2bc4a3d9c55e031bc5d015c5\` FOREIGN KEY (\`comment_id\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
};
