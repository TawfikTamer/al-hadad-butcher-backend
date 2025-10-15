export function SuccessResponse<T>(
  message = "Your Request is processed successfully",
  statusCode = 200,
  data?: T
) {
  return {
    meta: {
      statusCode,
      success: true,
    },
    data: {
      message,
      data,
    },
  };
}

export function FailedResponse<T>(
  message = "Your Request is Failed",
  statusCode = 500,
  error?: T
) {
  return {
    meta: {
      statusCode,
      success: false,
    },
    error: {
      message,
      error,
    },
  };
}
