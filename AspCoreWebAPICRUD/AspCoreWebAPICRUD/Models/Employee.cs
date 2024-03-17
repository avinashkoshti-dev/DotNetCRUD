using System;
using System.Collections.Generic;

namespace AspCoreWebAPICRUD.Models;

public partial class Employee
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Position { get; set; } = null!;

    public int Salary { get; set; }

    public string Gender { get; set; } = null!;

    public string? ProfileImage { get; set; }
}
