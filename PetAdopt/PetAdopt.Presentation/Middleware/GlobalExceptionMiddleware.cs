using Microsoft.AspNetCore.Http;
using PetAdopt.BusinessLogic.Helpers;
using System.Net;
using System.Text.Json;

namespace PetAdopt.Presentation.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public GlobalExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var response = context.Response;
            response.ContentType = "application/json";

            string userMessage;

            // Map exceptions to proper HTTP status codes
            switch (exception)
            {
                case UnauthorizedAccessException:
                    response.StatusCode = (int)HttpStatusCode.Forbidden;
                    userMessage = exception.Message;
                    break;

                case KeyNotFoundException:
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    userMessage = exception.Message;
                    break;

                case InvalidOperationException:
                case ArgumentException:
                    // Business rule violations -> 400 Bad Request
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    userMessage = exception.Message;
                    break;

                case Exception when exception.GetType() == typeof(Exception):
                    // Plain new Exception("...") from services = business logic error -> 400
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    userMessage = exception.Message;
                    break;

                default:
                    // Truly unexpected system errors -> 500
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    userMessage = "An unexpected error occurred. Please try again later.";
                    break;
            }

            var apiResponse = ApiResponse<object>.ErrorResponse(
                userMessage,
                new List<string> { userMessage }
            );

            var result = JsonSerializer.Serialize(apiResponse, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            return response.WriteAsync(result);
        }
    }
}
