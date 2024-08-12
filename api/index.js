const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 5500;

mongoose.connect("mongodb://localhost:27017/todolist")
  .then(() => {
    console.log('MongoDB ye başarıyla bağlandı.');
  })
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const todoSchema = new mongoose.Schema({
  addedBy: String,
  task: String,
  completed: Boolean,
  dueDate: Date,
  status: { type: String, default: 'açık' }, 
  assignedTo: { type: String, default: null } ,
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null } 
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/', (req, res) => {
  res.send('POST request received at root path');
});

app.post('/todos', async (req, res) => {
  try {
    const todo = new Todo({
      task: req.body.task, //görev nedir?
      completed: false, // tamamlandı mı ?
      addedBy: req.body.addedBy, // kim tarafından eklendi?
      status: req.body.status, // yapıldı mı yapılmadı mı?
      assignedTo: req.body.assignedTo, //kim tarafından yapıldı?
      createdAt: req.body.createdAt, // Oluşturulma tarihi?
      completedAt: req.body.completedAt //ne zaman tamamlandı
    });
    await todo.save();
    res.json(todo);
  } catch (error) {
    console.error("Görev Kaydedilirken Hata Oluştu:", error);
    res.status(500).json({ error: "Görev Kaydedilemedi" });
  }
});

app.put('/todos/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(todo);
});

app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Görev Silindi!' });
});

app.listen(port, () => {
  console.log(`Server bu portla bağlanacak ${port}`);
});