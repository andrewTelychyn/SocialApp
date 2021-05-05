using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace SocialApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
            //Console.WriteLine("Telychyn Andrew IT-81\nSocialApp Version 2 \n\n");

            //A a1 = new A();
            //A a2 = new A(a1);
            //A a3 = new A("test", 12);

            //Console.WriteLine("Initializers:");
            //A a4 = new A { Name = "test", Aggregation = new B(12)};


            //Console.Read();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }

    public class A
    {
        public string Name { get; set; }

        public B Aggregation { get; set; }

        public A()
        {
            Name = "Default constructor";
            Aggregation = new B();
            Console.WriteLine("Object A: made by default constructor \n");
        }

        public A(A a)
        {
            Name = a.Name;
            Aggregation = a.Aggregation;
            Console.WriteLine("Object A: made by copying constructor \n");
        }

        public A(string name, int number)
        {
            Name = name;
            Aggregation = new B(number);
            Console.WriteLine("Object A: made by constructor with parameters \n");
        }
    }

    public class B
    {
        public int Number { get; set; }

        public B(int number)
        {
            Number = number;
            Console.WriteLine("Object B: made by constructor with parameters");
        }

        public B()
        {
            Number = 1;
            Console.WriteLine("Object B: made by default constructor");
        }
    }
}
