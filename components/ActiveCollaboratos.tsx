import { useOthers } from '@liveblocks/react/suspense';
import Image from 'next/image';

// Define expected shape of collaborator info
type Collaborator = {
  id: string;
  avatar: string;
  name: string;
  color: string;
};

const ActiveCollaborators = () => {
  const others = useOthers();

  // Assert that other.info is of type Collaborator
  const collaborators = others
    .map((other) => other.info as Collaborator)
    .filter(Boolean); // Optional safety filter

  return (
    <ul className="collaborators-list">
      {collaborators.map(({ id, avatar, name, color }) => (
        <li key={id}>
          <Image 
            src={avatar}
            alt={name}
            width={100}
            height={100}
            className="inline-block size-8 rounded-full ring-2 ring-dark-100"
            style={{ border: `3px solid ${color}` }}
          />
        </li>
      ))}
    </ul>
  );
};

export default ActiveCollaborators;
