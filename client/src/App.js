import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const App = () => {
  const [state, setState] = useState(null);
  const [show, setShow] = useState(false);
  const [inputAuthor, setAuthor] = useState('');
  const [inputBook, setBook] = useState('');
  const [inputBio, setBio] = useState('');

  const getData = async () => {
    const response = await fetch('api/data');
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    handleClose();
    await fetch('/api/addBook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({ author: inputAuthor, book: inputBook, bio: inputBio }),
    }).catch(e => console.error(e.message));
    getData();
  };

  useEffect(() => {
    getData()
      .then(res => setState(res))
      .catch(err => console.error(err));
  }, [state]);

  return (
    <Container>
      <Navbar className='justify-content-between m-5'>
        <h1>Книги</h1>
        <Button className='text-white fs-4' onClick={handleShow} style={{ backgroundColor: '#E36A13' }} type='button'>
          Добавить книгу в коллекцию
        </Button>
      </Navbar>
      <Container as='main'>
        <Modal onHide={handleClose} show={show}>
          <Modal.Header closeButton>
          </Modal.Header>
          <Form onSubmit={handleSubmitForm}>
            <Modal.Body>
              <Form.Group className='mb-3' controlId='formAuthor'>
                <Form.Label>Автор</Form.Label>
                <Form.Control autoFocus onChange={(e) => setAuthor(e.target.value)} style={{ borderColor: '#E36A13' }} value={inputAuthor} placeholder='Имя автора' />
              </Form.Group>
              <Form.Group className='mb-3' controlId='formBook'>
                <Form.Label>Книга</Form.Label>
                <Form.Control onChange={(e) => setBook(e.target.value)} style={{ borderColor: '#E36A13' }} value={inputBook} placeholder='Название книги' />
              </Form.Group>
              <Form.Group className='mb-3' controlId='bio'>
                <Form.Label>Книга</Form.Label>
                <Form.Control onChange={(e) => setBio(e.target.value)} style={{ borderColor: '#E36A13' }} value={inputBio} placeholder='Цитата' />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' onClick={handleClose}>
                Отменить
              </Button>
              <Button style={{ backgroundColor: '#E36A13' }} type='submit'>
                Добавить
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        <Table borderless>
          <thead>
            <tr>
              <th><h4>№</h4></th>
              <th><h4>АВТОР</h4></th>
              <th><h4>НАЗВАНИЕ</h4></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {state === null ? '' : state.books.map((book) => {
              const author = state.authors.find((el) => el.authorStrId === book.authorStrId);
              return (
                <tr key={book.id}>
                  <th>{book.id}</th>
                  <th>
                    <OverlayTrigger trigger="click" placement="right" overlay={
                      <Popover id="bio">
                      <Popover.Header as="h3" className='text-white' style={{ backgroundColor: '#E36A13' }}>Цитата автора</Popover.Header>
                      <Popover.Body>
                        {author.bio}
                      </Popover.Body>
                    </Popover>
                    }>
                      <Button variant="link">{author.author}</Button>
                    </OverlayTrigger></th>
                  <th>{book.title}</th>
                  <th>Редактировать</th>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Container>
    </Container>
  );
};

export default App;
