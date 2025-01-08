const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Migration1736340155404 {
  name = 'Migration1736340155404';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE \`rbSubscriptionType\` 
        (
            \`id\` int NOT NULL AUTO_INCREMENT, 
            \`name\` varchar(64) NOT NULL,
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB
      ;`,
    );

    await queryRunner.query(`
      INSERT INTO \`rbSubscriptionType\` (name)
      VALUES ('trial'),
             ('payed'),
             ('free'),
             ('promo'),
             ('tech')
    ;`);

    await queryRunner.query(`
        ALTER TABLE \`userSubscription\` ADD COLUMN \`subscriptionTypeId\` int NOT NULL DEFAULT 1
    ;`);

    await queryRunner.query(`
    ALTER TABLE \`userSubscription\`
    ADD CONSTRAINT \`FK_userSubscription_subscriptionTypeId\` FOREIGN KEY (\`subscriptionTypeId\`) REFERENCES \`rbSubscriptionType\`(\`id\`)
    ;`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE IF EXISTS \`rbSubscriptionType\``);

    await queryRunner.query(`
      ALTER TABLE \`userSubscription\` DROP COLUMN \`subscriptionTypeId\`
    `);

    await queryRunner.query(
      `ALTER TABLE \`userSubscription\` DROP FOREIGN KEY \`FK_rbSubscription_userSubscription\`;`,
    );
  }
};
