'use server';

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

import { clerkClient as getClerkClient } from "@clerk/nextjs/server";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  if (!userIds?.length) return [];

  try {
    const clerk = await getClerkClient();  // <- correct!
    
    const { data } = await clerk.users.getUserList({
      emailAddress: userIds,
    });

    if (!data) return [];
    // console.log(data);
    
    const users = data.map((user) => ({
      id: user.id,
      name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
      email: user.emailAddresses[0].emailAddress,
      avatar: user.imageUrl,
    }));

    const sortedUsers = userIds.map((email) => users.find((user) => user.email === email));

    return parseStringify(sortedUsers);
  } catch (error) {
    console.error(`Error fetching users:`, error);
    return [];
  }
};

// export const getClerkUsers = async ({ userIds }: { userIds: string[]}) => {
//   try {
//     const { data } = await clerkClient.users.getUserList({
//       emailAddress: userIds,
//     });

//     const users = data.map((user) => ({
//       id: user.id,
//       name: `${user.firstName} ${user.lastName}`,
//       email: user.emailAddresses[0].emailAddress,
//       avatar: user.imageUrl,
//     }));

//     const sortedUsers = userIds.map((email) => users.find((user) => user.email === email));

//     return parseStringify(sortedUsers);
//   } catch (error) {
//     console.log(`Error fetching users: ${error}`);
//     return [];
//   }
// }

export const getDocumentUsers = async ({ roomId, currentUser, text }: { roomId: string, currentUser: string, text: string }) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);

    if(text.length) {
      const lowerCaseText = text.toLowerCase();

      const filteredUsers = users.filter((email: string) => email.toLowerCase().includes(lowerCaseText))

      return parseStringify(filteredUsers);
    }

    return parseStringify(users);
  } catch (error) {
    console.log(`Error fetching document users: ${error}`);
  }
}