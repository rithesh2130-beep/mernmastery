import mongoose from 'mongoose';

const uri = 'mongodb://rithesh:rithesh1234@ac-sqjz2wk-shard-00-00.g0e0wx4.mongodb.net:27017,ac-sqjz2wk-shard-00-01.g0e0wx4.mongodb.net:27017,ac-sqjz2wk-shard-00-02.g0e0wx4.mongodb.net:27017/mernmastery?ssl=true&replicaSet=atlas-k4oqp3-shard-0&authSource=admin&retryWrites=true&w=majority';

async function clear() {
  await mongoose.connect(uri);
  const result = await mongoose.connection.db.collection('users').deleteMany({});
  console.log('Deleted users:', result.deletedCount);
  process.exit(0);
}

clear();
