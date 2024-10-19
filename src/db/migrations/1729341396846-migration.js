const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Migration1729341396846 {
  name = 'Migration1729341396846';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE \`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`text\` text NOT NULL, \`created_user_id\` int NULL, \`post_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`report\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(100) NOT NULL DEFAULT '1 729 341 402 571', \`start_date_period\` date NULL, \`end_date_period\` date NULL, \`comment_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`report_comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`report_id\` int NULL, \`comment_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_1417e516e7fe353a87df4fb70fd\` FOREIGN KEY (\`created_user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_8aa21186314ce53c5b61a0e8c93\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`report\` ADD CONSTRAINT \`FK_8bb2bc4a3d9c55e031bc5d015c5\` FOREIGN KEY (\`comment_id\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_group\` ADD CONSTRAINT \`FK_1e61b4d2065f000f78a87138c4d\` FOREIGN KEY (\`report_id\`) REFERENCES \`report\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE \`report_comment\` ADD CONSTRAINT \`FK_3d44a7b84f2c8ebd91bf0d543b4\` FOREIGN KEY (\`report_id\`) REFERENCES \`report\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`report_comment\` ADD CONSTRAINT \`FK_dadffcfe7cefe043f26622315e6\` FOREIGN KEY (\`comment_id\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE \`report_comment\` DROP FOREIGN KEY \`FK_dadffcfe7cefe043f26622315e6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`report_comment\` DROP FOREIGN KEY \`FK_3d44a7b84f2c8ebd91bf0d543b4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_group\` DROP FOREIGN KEY \`FK_bb9982562cca83afb76c0ddc0d6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_group\` DROP FOREIGN KEY \`FK_1e61b4d2065f000f78a87138c4d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_8bb2bc4a3d9c55e031bc5d015c5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_8aa21186314ce53c5b61a0e8c93\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_1417e516e7fe353a87df4fb70fd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_group\` DROP COLUMN \`group_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_group\` DROP COLUMN \`is_scan\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_group\` DROP COLUMN \`report_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_group\` ADD \`is_scan\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_group\` ADD \`group_id\` int NULL`,
    );
    await queryRunner.query(`DROP TABLE \`report_comment\``);
    await queryRunner.query(`DROP TABLE \`report\``);
    await queryRunner.query(`DROP TABLE \`comment\``);
    await queryRunner.query(
      `CREATE INDEX \`FK_bb9982562cca83afb76c0ddc0d6\` ON \`user_group\` (\`group_id\`)`,
    );
  }
};
