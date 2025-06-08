"use client";
import { useAmount } from "../context/AmountContext";
import { useRouter } from "next/navigation";

const Amount = () => {
  const { amount, setAmount } = useAmount();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push("/split");
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Enter Amount
        </h2>
        <input
          id="amount"
          type="number"
          className="block w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition mb-4"
          placeholder="e.g. 100"
          value={amount === undefined ? "" : amount}
          onChange={(e) =>
            setAmount(e.target.value ? Number(e.target.value) : undefined)
          }
          required
        />
        <button
          className="w-full rounded-md py-2 px-6 bg-purple-600 text-white font-bold text-md hover:bg-purple-700 transition shadow-md"
          type="button"
          onClick={handleSubmit}
          disabled={amount === undefined || amount <= 0}
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default Amount;
