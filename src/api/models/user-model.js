const userItems = [
  {
    user_id: 3609,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@metropolia.fi',
    role: 'user',
    password: 'password',
  },
  {
    user_id: 3610,
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@metropolia.fi',
    role: 'admin',
    password: 'securepassword',
  },
  {
    user_id: 3611,
    name: 'Alice Johnson',
    username: 'alicej',
    email: 'alice@metropolia.fi',
    role: 'user',
    password: 'mypassword123',
  },
  {
    user_id: 3612,
    name: 'Bob Brown',
    username: 'bobbrown',
    email: 'bob@metropolia.fi',
    role: 'moderator',
    password: 'modpassword',
  },
];

const listAllUsers = () => {
  return userItems;
};

const findUserById = (id) => {
  return userItems.find((item) => item.cat_id === id);
};

const addUser = (cat) => {
  const {cat_name, weight, owner, filename, birthdate} = cat;
  const newId = userItems[0].cat_id + 1;
  userItems.unshift({
    cat_id: newId,
    cat_name,
    weight,
    owner,
    filename,
    birthdate,
  });
  return {cat_id: newId};
};

export {listAllUsers, findUserById, addUser};
