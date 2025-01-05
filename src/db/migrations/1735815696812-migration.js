const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Migration1735815696812 {
  name = 'Migration1735815696812';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE \`postIndicators\` (
                                           \`id\` int PRIMARY KEY AUTO_INCREMENT,
                                           \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                                           \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                                           \`deleted_at\` datetime(6) NULL,
                                           \`post_id\` int NOT NULL,
                                           \`json\` json NOT NULL,
                                           CONSTRAINT \`FK_PostPostIndicators\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`)
       )`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE \`postIndicators\``);
  }
};
