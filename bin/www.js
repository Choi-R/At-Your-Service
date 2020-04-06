const app = require('../index.js');
const port = process.env.PORT || 3001;

app.listen(port, () => 
console.log(`listening to port ${port}`))