export const newOrderContent = (order: any) => {
  const {
    fullName,
    email,
    phoneNumber,
    address,
    zone,
    additionalInfo,
    orderDate,
    orderPrice = 0,
    deliveryPrice = 0,
    totalPrice = 0,
    orderItemsHtml,
  } = order;
  return `
 <!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>طلب جديد</title>
  </head>

  <body
    style="
      font-family: 'Tahoma', Arial, sans-serif;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
      direction: rtl;
    "
  >
    <!-- Header -->
    <div
      style="
        background: linear-gradient(to right, #c40000, #ff4d4d);
        padding: 25px;
        text-align: center;
      "
    >
      <h1 style="color: white; margin: 0; font-size: 26px">
        تم استلام طلب جديد
      </h1>
    </div>

    <!-- Main Card -->
    <div
      style="
        max-width: 700px;
        margin: 20px auto;
        background: #ffffff;
        padding: 25px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      "
    >
      <!-- Customer Info -->
      <h2 style="color: #c40000; margin-bottom: 15px">بيانات العميل</h2>

      <table
        dir="rtl"
        style="
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
          text-align: right;
        "
      >
        <tr>
          <td style="padding: 4px 8px; font-weight: bold; width: 120px;">الاسم:</td>
          <td style="padding: 4px 8px">${fullName}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px; font-weight: bold">البريد:</td>
          <td style="padding: 4px 8px">${email}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px; font-weight: bold">الهاتف:</td>
          <td style="padding: 4px 8px">${phoneNumber}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px; font-weight: bold">العنوان:</td>
          <td style="padding: 4px 8px">${address} - ${zone}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px; font-weight: bold">ملاحظات:</td>
          <td style="padding: 4px 8px">${additionalInfo}</td>
        </tr>
      </table>

      <!-- Order Details -->
      <h2 style="color: #c40000; margin-bottom: 15px">تفاصيل الطلب</h2>

      <div
        style="
          border: 1px solid #ffcccc;
          border-radius: 6px;
          padding: 15px;
          background: #fff5f5;
        "
      >
        ${orderItemsHtml}
      </div>

      <!-- Footer Summary -->
      <div
        style="
          margin-top: 25px;
          padding-top: 15px;
          border-top: 2px solid #eee;
          font-size: 18px;
        "
      >
        <div style="margin-bottom: 10px; text-align: right;">
          <span style="font-weight: bold">تاريخ الطلب:</span> ${orderDate}
        </div>
        <div style="margin-bottom: 10px; text-align: right;">
          <span style="font-weight: bold">مجموع الطلب:</span> ${orderPrice} ج.م
        </div>
        <div style="margin-bottom: 10px; text-align: right;">
          <span style="font-weight: bold">التوصيل:</span> ${deliveryPrice} ج.م
        </div>
        <div style="font-weight: bold; color: #c40000; text-align: right; font-size: 20px; padding-top: 10px; border-top: 1px solid #eee;">
          <span style="color: #000">المجموع الكلي:</span> ${totalPrice} ج.م
        </div>
      </div>
    </div>

    <!-- Footer Notice -->
    <p
      style="text-align: center; color: #999; font-size: 12px; margin-top: 20px"
    >
      هذا الإشعار تم إرساله تلقائيًا من نظام الطلبات.
    </p>
  </body>
</html>
`;
};

export const orderItemsContet = (
  productName: string,
  quantity: number,
  price: number,
  lineTotal: number
) => {
  return `
  <div style="padding: 10px 0; border-bottom: 1px solid #ffd6d6; text-align: right;">
  <strong>${productName}</strong>
  <div style="color: #666; margin-top: 5px;">
    ${quantity} كجم × ${price} ج.م
  </div>
  <div style="font-weight: bold; color: #c40000; margin-top: 5px;">
    المجموع: ${lineTotal} ج.م
  </div>
</div>
  `;
};
