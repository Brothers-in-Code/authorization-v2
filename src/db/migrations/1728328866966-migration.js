const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Migration1728328866966 {
  name = 'Migration1728328866966';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE \`userPermission\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`permission\` tinyint NOT NULL, \`user_id\` int NULL, UNIQUE INDEX \`REL_f3e6433a5004b37b935f0e4681\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`userPermission\` ADD CONSTRAINT \`FK_f3e6433a5004b37b935f0e4681f\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE \`userPermission\` DROP FOREIGN KEY \`FK_f3e6433a5004b37b935f0e4681f\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_f3e6433a5004b37b935f0e4681\` ON \`userPermission\``,
    );
    await queryRunner.query(`DROP TABLE \`userPermission\``);
  }
};
