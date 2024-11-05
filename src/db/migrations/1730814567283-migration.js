const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1730814567283 {
    name = 'Migration1730814567283'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`comments\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`name\` \`name\` varchar(100) NOT NULL DEFAULT '1 730 814 569 159'`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`name\` \`name\` varchar(100) NOT NULL DEFAULT '1 729 626 324 601'`);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`comments\``);
    }
}
