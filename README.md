# Steps 
1. Create Database <Database Name>
2. Add Tabel to created database
3. Add packages to api project microsoft.entityframeworkcore.
4. Make InvariantGlobalization False in .csproj entry
5. Run Following command in Package Manager Console to add models classes
   Scaffold-DbContext "Server=AVINASH-PC\SQLEXPRESS;Database=DBFirst;Trusted_Connection=True;TrustServerCertificate=True" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models
6. Remove Connection string from dbcontext and add it to appsettngs.json file
7. Register connection string in program.cs file
   var provider = builder.Services.BuildServiceProvider();
   var config = provider.GetRequiredService<IConfiguration>();
   builder.Services.AddDbContext<StudentManagementSystemContext>(item => item.UseSqlServer(config.GetConnectionString("dbcs")));
		or
   builder.Services.AddDbContext<EmployeeMgmtContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("dbcs")));

8. Add Api Controller
9. Add cors policy to program file
  - add this line on top 
    var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
    var builder = WebApplication.CreateBuilder(args);
    builder.Services.AddCors(options =>
    {
        options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:7059", "https://localhost:7059")                          
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                      });
    });

- add this line to below app.UserHttpRedirection
    app.UseCors(MyAllowSpecificOrigins);
