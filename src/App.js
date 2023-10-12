
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';

function App() {

  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState(""); 
  const [albums, setAlbums] = useState([]);

  useEffect(()=>{
    const authParameters = {
      method : "POST",
      headers : {
        "Content-Type" : "application/x-www-form-urlencoded"
      },
      body : "grant_type=client_credentials&client_id=1f3fe53862944857ae23f739f23a9c79&client_secret=7d211f16bd2045a19d54cf07c530d8b7"
    }

    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then(result => result.json())
      .then(data => {
        setAccessToken(data.access_token)
      })
  }, [])

  async function handleSearch(){
    const searchParams = {
      method : "GET",
      headers : {
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer ' + accessToken
      }
    }

    let authorId = await fetch("https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist&limit=1" , searchParams)
      .then(res => res.json())
      .then(data => {return data.artists.items[0].id})

    let returnedAlbums = await fetch("https://api.spotify.com/v1/artists/" + authorId + "/albums?limit=50", searchParams)
      .then(res => res.json())
      .then(data => {setAlbums(data.items)})
  }

  return (
    <div className="App">
      <Container>
        <InputGroup className='m-3' size='lg'>
          <FormControl
            placeholder = "Input your search here"
            type = "input"
            onChange={ev=>{setSearchInput(ev.target.value)}}
          />
          <Button onClick={handleSearch}>
            Submit
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className='mb-2 row row-cols-5 justify-center'>
          {albums.map((album) => {

            return <Card className='m-1 p-2'  style={{ cursor: "pointer" }}>  
              <Card.Img className='mg-2' src = {album.images[0].url} />
              <Card.Body>
                <Card.Title>{album.name} </Card.Title>
                <Card.Text>{album.release_date} </Card.Text>
              </Card.Body>
            </Card>
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
