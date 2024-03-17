using AspCoreWebAPICRUD.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AspCoreWebAPICRUD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly DbfirstContext context;

        public EmployeeController(DbfirstContext context)
        {
            this.context = context;
        }

        [HttpGet("GetEmployees")]
        public async Task<ActionResult<List<Employee>>> GetEmployees()
        {
            var employees = await context.Employees.ToListAsync();
            return Ok(employees);
        }

        [HttpGet("GetEmployeeById/{id}")]
        public async Task<ActionResult<Employee>> GetEmployeeById(int id)
        {
            Dictionary<string, object> res = new Dictionary<string, object>();
            var employee = await context.Employees.FirstOrDefaultAsync(x=>x.Id==id);
            if (employee == null)
            {
                res["success"] = 0;
                res["message"] = "Employee Not Found";
                return NotFound(res);
            }           
            return Ok(employee);
        }

        [HttpPost("CreateEmployee")]
        public async Task<ActionResult<Employee>> CreateEmployee(Employee emp)
        {
            Dictionary<string, object> res = new Dictionary<string, object>();
            if (emp.Id == 0)
            {
                await context.Employees.AddAsync(emp);
                await context.SaveChangesAsync();
                res["success"] = 1;
                res["message"] = "Employee Created successfully";
                return Ok(res);
            }
            else
            {      
                if(context.Employees.Any(x=>x.Name==emp.Name && x.Id!=emp.Id))
                {
                    res["success"] = 0;
                    res["message"] = "Employee Not Found";
                    return BadRequest(res);
                }
                else
                {
                    context.Entry(emp).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                    res["success"] = 1;
                    res["message"] = "Employee Updated successfully";
                    return Ok(res);

                }                               
            }           
        }
       
        [HttpDelete("DeleteEmployee/{id}")]
        public async Task<ActionResult<Employee>> DeleteEmployee(int id)
        {
            Dictionary<string, object> res = new Dictionary<string, object>();
            var emp = await context.Employees.FirstOrDefaultAsync(x => x.Id == id);
            if (emp == null)
            {
                return NotFound();
            }
            context.Employees.Remove(emp);
            await context.SaveChangesAsync();
            res["success"] = 1;
            res["message"] = "Employee Deleted successfully";
            return Ok(res);
        }
    }
}
