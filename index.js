/*
 *Create a server that is going to be listening requests on port 9000
-Your Node App should be able to store a number in the path /myNumber. Use body payload to send the value: { myNumber: 123 }. Don't create one number per request, just create or update the current number.
-You can see the value number with a request to /myNumber
-If you receive a request from path /myNumber/{multiplier}, you should return in the response the value: myNumber*multiplier. If there is no current value for myNumber, return 400 error.
-Delete the current value with a request to /reset.
-If you try to use a non-numeric value to create/update myNumber, a 400 error should be returned.
-If there is no value stored, a 404 should be returned.
-Any other request should be handled with an error code 404, "resource not found". 
*/
var urlfull = require('full-url')
const http = require('http');
const number = [{}];
let currentId = 0;
const PORT = 9000;

const server = http.createServer((req, res) => {
  const { url, method, headers} = req; 
  
  
  let fullURL = new URL(urlfull(req));
  let host = fullURL.host;
  let path = fullURL.pathname;//withoutquery

 
  // View the number
  if (url === '/myNumber' && method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(number));
  }


  // Create the number
  else if (method === 'POST' && url === '/myNumber' ) {
    const body = [];
    
    req.on('data', (chunk) => {
      body.push(chunk);
    });

    req.on('end', () => {
      parsedBody = Buffer.concat(body).toString();
      parsedBody = JSON.parse(parsedBody);
      const numberTemp = parsedBody.myNumber
      if(typeof(numberTemp) === "number"){
        number[0].myNumber= parsedBody.myNumber
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 201;
        return res.end(JSON.stringify(number));
      }
      else{
      res.statusCode = 400;
      return res.end("Invalid Number");
      }
    });
  }

  // Update a current number

  else if (method === 'PUT' && path.match(/myNumber/)[0]==="myNumber" ) {
    const numberMultiplier = url.split('/')[2];

    if(numberMultiplier === undefined || numberMultiplier ===''){
      res.statusCode = 400
      return res.end('You have to send a number');
    }

    if(number[0].myNumber === undefined){
      res.statusCode = 400;
      return res.end('We do not have a number');
    }
    if(number.length === 0 ){
      res.statusCode = 404;
      return res.end('value no found');
    }
    
    if(numberMultiplier.match(/^([0-9])*$/)){
      number[0].myNumber = number[0].myNumber * numberMultiplier
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 201;
      return res.end(JSON.stringify(number));
    }
  

    res.statusCode = 400
    return res.end('invalid Number');
    
  }

  // Delete a current number
  else if (method === 'DELETE' && url === '/reset') {
    const animalId = parseInt(url.split('/')[2], 10);
    if (number[0].myNumber) {
      delete number[0].myNumber;
      return res.end('number deleted successfully');
    } else {
      res.statusCode = 400
      return res.end('It is already empty!');
    }
  }

  else {
  res.statusCode = 404;
  res.end('Resource not found');
  }
  
});


server.listen(PORT, null, null, () => {
  console.log('listening at 9000');
});