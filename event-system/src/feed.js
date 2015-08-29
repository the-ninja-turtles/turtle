import express from 'express';

let router = express.Router();

router.get('/feed', (req, res) => {
  /*
   * res.writeHead(200, {
   *  'Content-Type': 'text/event-stream',
   *  'Cache-Control': 'no-cache',
   *  'Connection': 'keep-alive'
   * });
   * res.write('\n');
   */
  res.send();
});

router.all('/feed', (req, res) => {
  res.status(405).json({error: 'Use GET to receive event stream'});
});

export default router;
