using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetAdopt.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddListedOwnerName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ListedOwnerName",
                table: "Pets",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ListedOwnerName",
                table: "Pets");
        }
    }
}
