import { mainServer } from "./main.js";


const port = 3000;
mainServer.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
   
});
