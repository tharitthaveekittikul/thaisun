// export const validTel = new RegExp(
//   "^\\s*(([+]\\s?\\d[-\\s]?\\d|0)?\\s?\\d([-\\s]?\\d){9}|[(]\\s?\\d([-\\s]?\\d)+\\s*[)]([-\\s]?\\d)+)\\s*$"
// );

// export const validTel = new RegExp(
//   "^\\s*\\(?(020[7,8]{1}\\)?[ ]?[1-9]{1}[0-9{2}[ ]?[0-9]{4})|(0[1-8]{1}[0-9]{3}\\)?[ ]?[1-9]{1}[0-9]{2}[ ]?[0-9]{3})\\s*$"
// );

export const validTel = new RegExp("^0\\d{4}[\\-]\\d{3}[\\-]\\d{3}?$");

export function formatPhoneNumber(value) {
  if (!value) return value;
  // clear input for any non-digit values
  const phoneNumber = value.replace(/[^\d]/g, "");

  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 6) return phoneNumber;

  if (phoneNumberLength < 10) {
    return `${phoneNumber.slice(0, 5)}-${phoneNumber.slice(5)}`;
  }
  return `${phoneNumber.slice(0, 5)}-${phoneNumber.slice(
    5,
    8
  )}-${phoneNumber.slice(8, 11)}`;
}
