﻿using System;
using System.Collections.Generic;

namespace AspCoreWebAPICRUD.Models;

public partial class Login
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? Name { get; set; }
}
