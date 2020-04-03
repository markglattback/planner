import mongoose from 'mongoose';
export { mongoose };

const withMongoose = handler => async (req, res) => {
  const connect = async () => {
    console.log('Connecting to database');
    
    mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true, 
    });
  }

  switch (mongoose.connections[0].readyState) {
    case 0: await connect();      
      return handler(req, res);      
    case 3: await connect();
      return handler(req, res);  
    default: return handler(req, res);
  }

}

export default withMongoose;