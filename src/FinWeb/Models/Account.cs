using System.ComponentModel.DataAnnotations;

public class AccountDto
{
    [Required]
    public string? Name { get; set; }

    [Required]
    public decimal Balance { get; set; }

    [Required]
    public DateTime Epoch { get; set; }
}