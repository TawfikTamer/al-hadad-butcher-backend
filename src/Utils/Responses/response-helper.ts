export function SuccessResponse<T>(
  message = "تم معالجة الطلب بنجاح",
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
  message = "فشل الطلب",
  statusCode = 500,
  error?: T
) {
  return {
    message,
    error,
  };
}
