export const validateAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const handleXMTPError = (error: any): string => {
  if (error.message.includes("canMessage")) {
    return "Recipient is not available on XMTP network";
  }
  if (error.message.includes("network")) {
    return "Network connection issue. Please try again.";
  }
  return "An unexpected error occurred. Please try again.";
};

export const formatBillMessage = (
  description: string,
  amount: number,
  userShare: number,
  paymentAddress: string
): string => {
  return `🧾 ${description}
Total: $${amount}
Your share: $${userShare}
Pay to: ${paymentAddress}

Powered by SplitMate`;
};