const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Migration1732834338152 {
  name = 'Migration1732834338152';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE \`user_group\` DROP FOREIGN KEY \`FK_bb9982562cca83afb76c0ddc0d6\``);
    await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_6d0d5abc465edbc42e054d0bb75\``);
    await queryRunner.query(`CREATE TABLE \`vk_group\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`vkid\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`screen_name\` varchar(255) NOT NULL, \`is_private\` varchar(255) NULL, \`photo\` varchar(1000) NULL, \`last_group_scan_date\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`name\` \`name\` varchar(100) NOT NULL DEFAULT '1 732 834 340 059'`);
    await queryRunner.query(`ALTER TABLE \`user_group\` ADD CONSTRAINT \`FK_bb9982562cca83afb76c0ddc0d6\` FOREIGN KEY (\`group_id\`) REFERENCES \`vk_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_6d0d5abc465edbc42e054d0bb75\` FOREIGN KEY (\`group_id\`) REFERENCES \`vk_group\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_6d0d5abc465edbc42e054d0bb75\``);
    await queryRunner.query(`ALTER TABLE \`user_group\` DROP FOREIGN KEY \`FK_bb9982562cca83afb76c0ddc0d6\``);
    await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`name\` \`name\` varchar(100) NOT NULL DEFAULT '1 730 814 569 159'`);
    await queryRunner.query(`DROP TABLE \`vk_group\``);
    await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_6d0d5abc465edbc42e054d0bb75\` FOREIGN KEY (\`group_id\`) REFERENCES \`group\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE \`user_group\` ADD CONSTRAINT \`FK_bb9982562cca83afb76c0ddc0d6\` FOREIGN KEY (\`group_id\`) REFERENCES \`group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }
};
