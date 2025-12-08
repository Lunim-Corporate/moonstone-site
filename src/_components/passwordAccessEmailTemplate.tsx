// Style according to your email template needs
export default function passwordAccessEmailTemplate({
  name,
  email,
  phoneNumber,
  companyName,
  message,
}: {
  name: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  message: string;
}) {
  return (
    <div>
      <p className="font-bold">Name: {name}</p>
      <p className="font-bold">Email: {email}</p>
      {/* Optional fields */}
      <p className="font-bold">Phone: {phoneNumber ? phoneNumber : "N/A"}</p>
      <p className="font-bold">Company: {companyName ? companyName : "N/A"}</p>
      {/* End Optional fields */}
      <p className="font-bold">Message:</p>
      <div>{message}</div>
    </div>
  );
}
