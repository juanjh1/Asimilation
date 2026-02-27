import { asi, url} from "../core/main.js"
import { createErrorResponseHandler } from '../helpers/error-response.js'

asi.setup(3000, import.meta.url)

url.addPath("/", (req, res) => {

 res.sendJson({"fala": "mano"}, 200)
})
asi.run()
