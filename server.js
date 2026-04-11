import app from "./src/app.js";

import checkRouter from './src/routes/check.js';

const PORT = process.env.PORT || 5000;

// testing route
app.use('/check', checkRouter);



app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));




