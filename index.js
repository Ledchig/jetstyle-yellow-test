import express from 'express';
import fs from 'fs';

const encode = (string) => {
  const bytes = new TextEncoder().encode(string);
  const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join("");
  return btoa(binString);
}

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());

app.get('/api/data', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
    res.json(data);
});

app.post('/api/addBook', async (req, res) => {
  const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
  const reqData = req.body;
  console.log(req.body);
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
  console.log(newData);
  fs.writeFileSync('./data.json', JSON.stringify(newData, null, '  '));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
