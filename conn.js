import { createConnection } from 'mysql';

const connection = createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Totodile360!',
});

connection.connect((error) => {
  if(error){
    console.log('Error connecting to the MySQL Database');
    return;
  }
  console.log('Connection established sucessfully');
});
connection.end((error) => {
  console.log(error);
});