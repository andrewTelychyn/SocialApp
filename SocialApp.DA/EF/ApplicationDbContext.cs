using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer;
using SocialApp.DA.Entities;
using Microsoft.EntityFrameworkCore.Proxies;
using System;
using System.Collections.Generic;
using System.Text;
using System.Data;

namespace SocialApp.DA.EF
{
    public class ApplicationDbContext : DbContext
    {
        private readonly string _connectingString;

        public ApplicationDbContext(string connectionString) : base()
        {
            _connectingString = connectionString;
            Database.EnsureCreated();
        }

        
        public DbSet<Comment> Comments { get; set; }

        public DbSet<Post> Posts { get; set; }

        public DbSet<UserProfile> UserProfiles { get; set; }

        public DbSet<ApplicationRole> Roles { get; set; }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder
                .UseLazyLoadingProxies()
                .UseSqlServer(_connectingString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Post>(entity =>
            {
                entity.HasOne(p => p.UserProfile).WithMany(u => u.Posts).IsRequired();

                //entity.HasMany(p => p.Likes).WithMany(u => u.Posts);

                entity.HasMany(p => p.Comments).WithOne(c => c.Post);
            });

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.HasOne(c => c.Post).WithMany(p => p.Comments).IsRequired();

                entity.HasOne(c => c.UserProfile);

                entity.HasMany(c => c.Likes);
            });

            modelBuilder.Entity<UserProfile>(entity =>
            {
                entity.HasMany(u => u.Posts).WithOne(p => p.UserProfile);

                entity.HasMany(u => u.Subscribers).WithMany(u => u.Subscriptions);

                entity.HasMany(u => u.Subscriptions).WithMany(u => u.Subscribers);

                entity.HasOne(u => u.ApplicationUser).WithOne(a => a.UserProfile).IsRequired();
            });

            modelBuilder.Entity<ApplicationUser>(entity =>
            {
                entity.HasOne(a => a.UserProfile).WithOne(u => u.ApplicationUser).IsRequired();
            });
        }
    }
}


