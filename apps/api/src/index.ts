import { createServer } from './server';
import { env } from './env';

const app = createServer();
const port = env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
