const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Migration1728415130532 {
  name = 'Migration1728415130532';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE \`userSubscription\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`permission\` tinyint NOT NULL, \`user_id\` int NULL, UNIQUE INDEX \`REL_6ca3488df244b47b5b01033de7\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`userSubscription\` ADD CONSTRAINT \`FK_6ca3488df244b47b5b01033de79\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE \`userSubscription\` DROP FOREIGN KEY \`FK_6ca3488df244b47b5b01033de79\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_6ca3488df244b47b5b01033de7\` ON \`userSubscription\``,
    );
    await queryRunner.query(`DROP TABLE \`userSubscription\``);
  }
};
