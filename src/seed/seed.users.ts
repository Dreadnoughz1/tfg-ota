/*import * as bcrypt from 'bcrypt';

async function seedUsers() {
  const users = [
    { username: 'admin', password: 'admin123' },
    { username: 'user1', password: 'user123' },
    { username: 'user2', password: 'user456' },
  ];

  for (const u of users) {
    u.password = await bcrypt.hash(u.password, 10);
  }
  console.log('Usuarios seed creados');
  process.exit(0);
}

seedUsers().catch((err) => {
  console.error('Error creando seed', err);
  process.exit(1);
});
*/
