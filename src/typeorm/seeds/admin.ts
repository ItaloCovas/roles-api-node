import 'dotenv/config';
import { hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { dataSource } from '../../database';

async function create() {
  const connection = await dataSource.initialize();

  // Creating role
  const roleId = uuidv4();
  await connection.query(
    `INSERT INTO roles(id, name) values('${roleId}', 'Desenvolvedor de Software')`,
  );

  // Creating user
  const userId = uuidv4();
  const userPassword = process.env.USER_SEED_PASSWORD ?? '';
  const password = await hash(userPassword, 10);
  await connection.query(
    `INSERT INTO users(id, name, email, password, isAdmin, roleId) values('${userId}', 'Ítalo Covas', 'italocovas@gmail.com', '${password}', true, '${roleId}')`,
  );
  await connection.destroy();
}

create().then(() => {
  console.log('Admin created');
});
