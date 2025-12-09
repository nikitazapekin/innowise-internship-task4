import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`;

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserData {
  user: User;
}

function GraphQl() {
  const { loading, error, data } = useQuery<UserData>(GET_USER, {
    variables: { id: "1" },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error fetching user: {error.message}</p>;

  const user = data?.user;

  if (!user) return <p>No user found.</p>;

  return (
    <div>
      <h1> User Info</h1>
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  );
}

export default GraphQl;
