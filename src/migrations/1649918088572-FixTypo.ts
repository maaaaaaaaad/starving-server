import {MigrationInterface, QueryRunner} from "typeorm";

export class FixTypo1649918088572 implements MigrationInterface {
    name = 'FixTypo1649918088572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Recipe" RENAME COLUMN "FOOD_INGREDIENT" TO "FOOD_INGREDIENTS"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Recipe" RENAME COLUMN "FOOD_INGREDIENTS" TO "FOOD_INGREDIENT"`);
    }

}
