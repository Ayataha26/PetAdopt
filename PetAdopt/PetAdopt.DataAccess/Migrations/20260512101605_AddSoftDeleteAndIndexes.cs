using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetAdopt.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddSoftDeleteAndIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Pets",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "Pets",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Breed",
                table: "Pets",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "AnimalType",
                table: "Pets",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Pets",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Pets_AnimalType",
                table: "Pets",
                column: "AnimalType");

            migrationBuilder.CreateIndex(
                name: "IX_Pets_Breed",
                table: "Pets",
                column: "Breed");

            migrationBuilder.CreateIndex(
                name: "IX_Pets_IsApproved",
                table: "Pets",
                column: "IsApproved");

            migrationBuilder.CreateIndex(
                name: "IX_Pets_Location",
                table: "Pets",
                column: "Location");

            migrationBuilder.CreateIndex(
                name: "IX_Pets_Status",
                table: "Pets",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Pets_AnimalType",
                table: "Pets");

            migrationBuilder.DropIndex(
                name: "IX_Pets_Breed",
                table: "Pets");

            migrationBuilder.DropIndex(
                name: "IX_Pets_IsApproved",
                table: "Pets");

            migrationBuilder.DropIndex(
                name: "IX_Pets_Location",
                table: "Pets");

            migrationBuilder.DropIndex(
                name: "IX_Pets_Status",
                table: "Pets");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Pets");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Pets",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "Pets",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Breed",
                table: "Pets",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "AnimalType",
                table: "Pets",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
