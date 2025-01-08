const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Migration1732916829368 {
  name = 'Migration1732916829368';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`user_vkid\` int NOT NULL, \`access_token\` varchar(1000) NOT NULL, \`refresh_token\` varchar(1000) NOT NULL, \`device_id\` varchar(1000) NOT NULL, \`expires_date\` datetime NULL, UNIQUE INDEX \`IDX_USER_USER_VKID\` (\`user_vkid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`userSubscription\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`subscription\` tinyint NOT NULL, \`user_id\` int NULL, UNIQUE INDEX \`REL_c6be1f2cba5ee4da18e3432c5b\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`report\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(100) NOT NULL DEFAULT '1 732 916 831 451', \`description\` varchar(1000) NOT NULL, \`start_date_period\` date NULL, \`end_date_period\` date NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_report\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`user_id\` int NULL, \`report_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`vk_group\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`vkid\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`screen_name\` varchar(255) NOT NULL, \`is_private\` varchar(255) NULL, \`photo\` varchar(1000) NULL, \`last_group_scan_date\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_group\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`is_scan\` int NOT NULL DEFAULT '0', \`user_id\` int NULL, \`group_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`post_vkid\` int NOT NULL, \`likes\` int NOT NULL, \`views\` int NOT NULL, \`comments\` int NOT NULL, \`timestamp_post\` bigint NOT NULL, \`json\` json NOT NULL, \`group_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`text\` text NOT NULL, \`created_user_id\` int NULL, \`post_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`report_comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`report_id\` int NULL, \`comment_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`userSubscription\` ADD CONSTRAINT \`FK_c6be1f2cba5ee4da18e3432c5be\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_report\` ADD CONSTRAINT \`FK_3d355b3cbf05ae70386830ce05a\` 
    FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_report\` ADD CONSTRAINT \`FK_eae411a4a5c228ad64b2c7ecba4\` FOREIGN KEY (\`report_id\`) REFERENCES \`report\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_group\` ADD CONSTRAINT \`FK_7ded8f984bbc2ee6ff0beee491b\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_group\` ADD CONSTRAINT \`FK_bb9982562cca83afb76c0ddc0d6\` FOREIGN KEY (\`group_id\`) REFERENCES \`vk_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD CONSTRAINT \`FK_6d0d5abc465edbc42e054d0bb75\` FOREIGN KEY (\`group_id\`) REFERENCES \`vk_group\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_1417e516e7fe353a87df4fb70fd\` FOREIGN KEY (\`created_user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_8aa21186314ce53c5b61a0e8c93\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_8aa21186314ce53c5b61a0e8c93\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_1417e516e7fe353a87df4fb70fd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_6d0d5abc465edbc42e054d0bb75\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_group\` DROP FOREIGN KEY \`FK_bb9982562cca83afb76c0ddc0d6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_group\` DROP FOREIGN KEY \`FK_7ded8f984bbc2ee6ff0beee491b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_report\` DROP FOREIGN KEY \`FK_eae411a4a5c228ad64b2c7ecba4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_report\` DROP FOREIGN KEY \`FK_3d355b3cbf05ae70386830ce05a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`userSubscription\` DROP FOREIGN KEY \`FK_c6be1f2cba5ee4da18e3432c5be\``,
    );
    await queryRunner.query(`DROP TABLE \`report_comment\``);
    await queryRunner.query(`DROP TABLE \`comment\``);
    await queryRunner.query(`DROP TABLE \`post\``);
    await queryRunner.query(`DROP TABLE \`user_group\``);
    await queryRunner.query(`DROP TABLE \`vk_group\``);
    await queryRunner.query(`DROP TABLE \`user_report\``);
    await queryRunner.query(`DROP TABLE \`report\``);
    await queryRunner.query(
      `DROP INDEX \`REL_c6be1f2cba5ee4da18e3432c5b\` ON \`userSubscription\``,
    );
    await queryRunner.query(`DROP TABLE \`userSubscription\``);
    await queryRunner.query(`DROP INDEX \`IDX_USER_USER_VKID\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
  }
};
