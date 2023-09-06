import express from 'express';
import fs from 'fs';

/**
 * идея хорошая, но смысл в идентификатора обычно именно
 * в уникальности, для этого лучше использовать специальные библиотеки
 * на подобие nanoid, uuid
 */
const encode = (string) => {
  const bytes = new TextEncoder().encode(string);
  const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join("");
  return btoa(binString);
}

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());

/**
 * очень хорошо в эндпоинтах которые ты делаешь
 * не забывать обрабатывать ошибки, ведь даже с простое
 * чтением файла или превращение его из JSON в JS объект
 * может вызывать непредвиденное поведение,
 * так же хорошо проставлять статусы ответа сервера
 * 
 *   try {
 *    const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
 *    res.status(200).json(data);
 *   } catch (error) {
 *    res.status(500).json({ error })
 *   }
 * 
 */
app.get('/api/data', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
    res.json(data);
});

/**
 * вот тут есть следующие не очень хорошие вещи
 * в основном в классическом вебе не приветствуется 
 * camelCase в строке url, хоть и он рабочий, чаще всего
 * используется kebab-case
 * 
 * код не отправляет ответ от сервера на клиент
 * поэтому клиент достоверно не знает что случилось на сервере
 */
app.post('/api/addBook', async (req, res) => {
  const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
  const reqData = req.body;
  const author = data.authors.find((el) => el.author === reqData.author);
  const newAuthor = author === undefined ? { 
    id: data.authors.length + 1,
    author: reqData.author,
    bio: reqData.bio,
    authorStrId: encode(reqData.author),
   } : author;
  const newBook = {
    id: data.books.length + 1,
    authorStrId: newAuthor.authorStrId,
    title: reqData.book,
  };
  const newData = { books: [...data.books, newBook], authors: [...data.authors, newAuthor] };
  fs.writeFileSync('./data.json', JSON.stringify(newData, null, '  '));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
