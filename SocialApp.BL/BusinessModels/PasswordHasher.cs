using System;
using System.Collections.Generic;
using System.Text;
using System.Security.Cryptography;


namespace SocialApp.BL.BusinessModels
{
    public class PasswordHasher
    {
        private readonly SHA256 hashAlgorithm;

        public PasswordHasher()
        {
            hashAlgorithm = SHA256.Create();
        }

        public string GetHash(string input)
        {
            // Convert the input string to a byte array and compute the hash.
            byte[] data = hashAlgorithm.ComputeHash(Encoding.UTF8.GetBytes(input));

            // Create a new Stringbuilder to collect the bytes
            // and create a string.
            var sBuilder = new StringBuilder();

            // Loop through each byte of the hashed data
            // and format each one as a hexadecimal string.
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }

            // Return the hexadecimal string.
            return sBuilder.ToString();
        }

        public bool VerifyHash(string input, string hash)
        {
            // Hash the input.
            var hashOfInput = GetHash(input);

            // Create a StringComparer an compare the hashes.
            StringComparer comparer = StringComparer.OrdinalIgnoreCase;

            return comparer.Compare(hashOfInput, hash) == 0;
        }

        public void Dispose()
        {
            hashAlgorithm.Dispose();
        }
    }
}
