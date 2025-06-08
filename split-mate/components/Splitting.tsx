import { useState } from "react";

type BillDetail = {
  id: number;
  name: string;
  price: number;
};

type Friend = {
  id: number;
  name: string;
  billDetails: BillDetail[];
};

type BillInput = {
  bill: number;
  friendId: number;
  name: string;
};

const SplitBill = () => {
  const [friends, setFriends] = useState<Friend[]>([]);

  const addFriend = (name: string) => {
    setFriends((prev) => [...prev, { id: Date.now(), name, billDetails: [] }]);
  };

  const calculateBill = (
    friends: Friend[],
    billDetails: BillInput
  ): Friend[] => {
    const amountPrice = Math.round(billDetails.bill / friends.length);
    const updatedFriends: Friend[] = [];

    for (const friend of friends) {
      if (friend.id === billDetails.friendId) {
        updatedFriends.push({ ...friend });
        continue;
      }

      const existingIndex = friend.billDetails.findIndex(
        (entry) => entry.id === billDetails.friendId
      );

      const updatedBillDetails = [...friend.billDetails];

      if (existingIndex !== -1) {
        updatedBillDetails[existingIndex].price += amountPrice;
      } else {
        updatedBillDetails.push({
          id: billDetails.friendId,
          name: billDetails.name,
          price: amountPrice,
        });
      }

      updatedFriends.push({
        ...friend,
        billDetails: updatedBillDetails,
      });
    }
    console.log("Updated friend: ", updatedFriends);

    return updatedFriends;
  };

  const onBillPaid = (billDetails: BillInput) => {
    setFriends((prev) => calculateBill(prev, billDetails));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex gap-4 mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => addFriend("Alice")}
        >
          Add Friend: Alice
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          onClick={() => addFriend("Bob")}
        >
          Add Friend: Bob
        </button>
      </div>
      <button
        className="w-full px-4 py-2 mb-4 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
        onClick={() =>
          onBillPaid({
            bill: 300,
            friendId: friends[0]?.id || 0,
            name: friends[0]?.name || "Alice",
          })
        }
      >
        Alice Paid 300
      </button>
      <pre className="bg-gray-100 p-4 text-black rounded text-sm overflow-x-auto">
        {JSON.stringify(friends, null, 2)}
      </pre>
    </div>
  );
};

export default SplitBill;
