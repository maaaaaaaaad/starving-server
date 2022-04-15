import {MigrationInterface, QueryRunner} from "typeorm";

export class Update1649993168713 implements MigrationInterface {
    name = 'Update1649993168713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Recipe" ("PK" SERIAL NOT NULL, "CREATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "DELETE_AT" TIMESTAMP, "TITLE" character varying NOT NULL, "DESCRIPTION" character varying NOT NULL, "MAIN_TEXT" character varying NOT NULL, "COOK_IMAGES" json NOT NULL, "categoryPk" integer, "ownerPk" integer, CONSTRAINT "PK_1658c02c48a2134a40d979bc8f3" PRIMARY KEY ("PK"))`);
        await queryRunner.query(`ALTER TABLE "Recipe" ADD CONSTRAINT "FK_f39b41bc99317562b4eb2507a3d" FOREIGN KEY ("categoryPk") REFERENCES "Category"("PK") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Recipe" ADD CONSTRAINT "FK_e7b03eab10b0abe0944ad10acc9" FOREIGN KEY ("ownerPk") REFERENCES "User"("PK") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Recipe" DROP CONSTRAINT "FK_e7b03eab10b0abe0944ad10acc9"`);
        await queryRunner.query(`ALTER TABLE "Recipe" DROP CONSTRAINT "FK_f39b41bc99317562b4eb2507a3d"`);
        await queryRunner.query(`DROP TABLE "Recipe"`);
    }

}
