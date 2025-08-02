"use client";
import { useState } from "react";
import { useAmount } from "../context/AmountContext";

type SplitType = "equal" | "custom";
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
  const { amount } = useAmount();
  const [isOpen, setIsOpen] = useState(false);
  const [splitType, setSplitType] = useState<SplitType>("equal");
  const [friends, setFriends] = useState<Friend[]>([]);

  const [showInput, setShowInput] = useState(false);
  const [friendName, setFriendName] = useState("");

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleSelect = (type: SplitType) => {
    setSplitType(type);
    closeDropdown();
  };

  const addFriend = (name: string) => {
    if (!name.trim()) return;
    setFriends((prev) => [
      ...prev,
      { id: Date.now(), name: name.trim(), billDetails: [] },
    ]);
    setFriendName("");
    setShowInput(false);
  };

  const removeFriend = (id: number) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
  };
  const totalPeople = friends.length + 1;
const amountPerPerson = ((amount ?? 0) / totalPeople).toFixed(2);
  const calculateBill = (
    friends: Friend[],
    billDetails: BillInput
  ): Friend[] => {
    const numPeople = friends.length;
    const amountPerPerson = Math.round(billDetails.bill / numPeople);

    const updatedFriends: Friend[] = [];

    for (const friend of friends) {
      if (friend.id === billDetails.friendId) {
        updatedFriends.push({ ...friend }); // payer, skip updates
        continue;
      }

      const existingIndex = friend.billDetails.findIndex(
        (entry) => entry.id === billDetails.friendId
      );

      const updatedBillDetails = [...friend.billDetails];

      if (existingIndex !== -1) {
        updatedBillDetails[existingIndex].price += amountPerPerson;
      } else {
        updatedBillDetails.push({
          id: billDetails.friendId,
          name: billDetails.name,
          price: amountPerPerson,
        });
      }

      updatedFriends.push({
        ...friend,
        billDetails: updatedBillDetails,
      });
    }

    console.log("Updated Friends with Bills:", updatedFriends);
    return updatedFriends;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
      <p className="text-xl text-black font-semibold mb-4 text-center">
        Amount paid: <span className="text-blue-700 font-bold">₹{amount}</span>
      </p>
      <div className="relative inline-block text-left mb-6">
        <button
          type="button"
          className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={toggleDropdown}
        >
          {splitType === "equal" ? "Equal Split" : "Custom Split"} ▼
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <ul className="py-1">
              <li>
                <button
                  onClick={() => handleSelect("equal")}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    splitType === "equal"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Equal Split
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSelect("custom")}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    splitType === "custom"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Custom Split
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {splitType === "equal" && (
        <div>
          <h2 className="text-lg font-semibold mb-2 text-black">
            Participants
          </h2>
          <div className="grid gap-3 mb-4">
            <div className="flex items-center bg-blue-50 rounded-lg px-4 py-2 shadow-sm">
              <span className="font-medium text-blue-700 mr-2">You</span>
              <span className="ml-auto text-gray-700 font-semibold">
                ₹{amountPerPerson}
              </span>
            </div>
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center bg-gray-100 rounded-lg px-4 py-2 shadow-sm"
              >
                <span className="font-medium text-gray-800 mr-2">
                  {friend.name}
                </span>
                <span className="ml-auto text-gray-700 font-semibold">
                  ₹{amountPerPerson}
                </span>
                <button
                  onClick={() => removeFriend(friend.id)}
                  className="ml-3 text-red-500 hover:text-red-700 text-xs"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            className="mb-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
            onClick={() => setShowInput(true)}
          >
            Add Friend
          </button>

          {showInput && (
            <div className="flex items-center mt-2 gap-2">
              <input
                type="text"
                placeholder="Friend's name"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <button
                onClick={() => addFriend(friendName)}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowInput(false);
                  setFriendName("");
                }}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {splitType === "custom" && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Custom Split</h2>
          <p className="text-sm text-gray-500">Coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default SplitBill;
