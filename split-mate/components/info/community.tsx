"use client";
import { Users } from "lucide-react";

export default function CommunityForum() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-[#0070f3]" />
        <h1 className="text-3xl font-bold text-[#0070f3]">Community Forum</h1>
      </div>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        Connect with other users, share experiences, and get help from the community. Our forum is the perfect place to discuss bill splitting strategies, crypto payment tips, and app improvements.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Popular Topics:</h2>
      <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
        <li>Bill splitting best practices</li>
        <li>Base blockchain transaction optimization</li>
        <li>XMTP messaging tips and tricks</li>
        <li>Group management strategies</li>
        <li>Feature requests and suggestions</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Community Guidelines:</h2>
      <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
        <li>Be respectful and helpful to other members</li>
        <li>Stay on topic related to SplitMate and bill splitting</li>
        <li>No spam or promotional content</li>
        <li>Help newcomers get started with the app</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Get Involved:</h2>
      <p className="text-gray-700 dark:text-gray-200">
        Share your SplitMate success stories, suggest new features, report bugs, and help other users troubleshoot issues. Our community is powered by users like you who want to make bill splitting easier for everyone.<br />
        Moderators are available to help maintain a positive environment for all users.
      </p>
    </main>
  );
}