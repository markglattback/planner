import { mongoose } from '../lib/withMongoose';

const Schema = mongoose.Schema;
const { ObjectId } = mongoose.SchemaTypes;

// Users
const userSchema = new Schema({
  firstname: {
    required: true,
    type: String,
  },
  surname: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
    index: true,
    unique: true,
    minlength: 1,
    trim: true,
  },
  password: {
    required: true,
    type: String,
  },
  refreshTokenVersion: {
    required: true,
    type: Number,
    default: 1,  
  } 
}, {
  timestamps: true 
});

export const User = mongoose.models.user || mongoose.model('user', userSchema, 'users');

// Tasks
const taskSchema = new Schema({
   title: {
     required: true,
     type: String,   
   },
   description: {
     type: String, 
   },
   category: {
    required: true,   
    type: ObjectId,
   },
   type: {
    required: true,   
    type: ObjectId,
   },
   comments: {
     type: [String],
   },
   assignedTo: {
    required: true,
    type: ObjectId,  
   },
   priority: {
     required: true,
     type: ObjectId,  
   },
   dueAt: {
     required: true,
     type: Date,  
   },
   createdBy: {
     required: true,
     type: ObjectId,  
   },   
}, { timestamps: true });

export const Task = mongoose.models.task || mongoose.model('task', taskSchema, 'tasks');

// Categories
const categorySchema = new Schema({
  name: {
    type: String,
    required: true  
  }
}, { timestamps: true });

export const Category = mongoose.models.category || mongoose.model('category', categorySchema, 'categories');

// TaskTypes
const taskTypeSchema = new Schema({
  name: {
    type: String,
    required: true  
  },
  category: {
    type: ObjectId 
  },
}, { timestamps: true });

export const TaskType = mongoose.models.taskType || mongoose.model('taskType', taskTypeSchema, 'taskTypes');
