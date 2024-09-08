import Fastify from 'fastify';
import mongoose from 'mongoose';
import fastifyCors from '@fastify/cors';

const fastify = Fastify({ logger: true });


mongoose.connect('mongodb+srv://islomali3110:j4yWYlgZjL1p5gbp@cluster0.pjavn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

interface Todo {
  title: string;
  completed: boolean;
}


const TodoSchema = new mongoose.Schema<Todo>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const TodoModel = mongoose.model('Todo', TodoSchema);

fastify.register(fastifyCors);

fastify.get('/todos', async (request, reply) => {
  const todos = await TodoModel.find();
  reply.send(todos);
});

fastify.post('/todos', async (request, reply) => {
  const todo = new TodoModel(request.body);
  await todo.save();
  reply.send(todo);
});

fastify.delete('/todos/:id', async (request:any, reply) => {
  await TodoModel.findByIdAndDelete(request.params.id);
  reply.send({ status: 'ok' });
});

const start = async () => {
  try {
    await fastify.listen({ port: 5000 });
    console.log('Server running on http://localhost:5000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();